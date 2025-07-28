
'use server';
/**
 * @fileOverview AI flow for general conversation with Japa Genie, capable of providing visa recommendations and fetching web information.
 *
 * - generalChat - A function that handles conversational chat, can provide visa recommendations, and can fetch web information.
 * - GeneralChatInput - The input type for the generalChat function.
 * - GeneralChatOutput - The return type for the generalChat function.
 */

import {ai} from '@/ai/genkit';
import {z}
from 'genkit';
import {getVisaOptions, type VisaOption} from '@/services/visa-options';
import {extractWebContent, type WebContentExtractorInput, type WebContentExtractorOutput} from '@/ai/flows/web-content-extractor';

// Define Zod schema for chat history parts
const ChatMessagePartSchema = z.object({
  text: z.string(),
});

// Define Zod schema for a single chat message (user or model)
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(ChatMessagePartSchema),
});

const GeneralChatInputSchema = z.object({
  chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
  currentMessage: z.string().describe('The latest message from the user.'),
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const VisaRecommendationSchemaForOutput = z.object({
    name: z.string(),
    cost: z.object({ usd: z.number() }),
    requirements: z.object({ minimumEducation: z.string(), minimumWorkExperience: z.string() }),
    processingTime: z.string(),
    successRate: z.number().describe('The estimated success rate for a candidate with a similar profile, as a percentage (e.g., 85 for 85%).'),
    reason: z.string().optional().describe('DETAILED, coach-like reason why this visa is recommended, including insightful tips, potential strategies, or important considerations. This should reflect the persona of a seasoned visa coach, providing comprehensive advice.'),
  });

const GeneralChatOutputSchema = z.object({
  conversationalReply: z.string().describe("Japa Genie's conversational response to the user. This response MUST be detailed, empathetic, and reflect the persona of a seasoned visa coach."),
  visaRecommendations: z.array(VisaRecommendationSchemaForOutput).optional().describe('Optional visa recommendations if generated during the conversation. Omit if none generated, or provide an empty array. Each recommendation MUST include name, cost, requirements, processingTime, successRate, and a detailed reason.'),
  webAnalysisContext: z.string().nullable().optional().describe('Context or summary from web analysis, if performed. If no analysis or if analysis results are not meaningful (e.g., "could not find information", "error occurred", "summarization failed", "sources inaccessible"), this field SHOULD BE OMITTED by the LLM, or can be null (which will be treated as omitted by the flow).'),
});
export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;


export async function generalChat(input: GeneralChatInput): Promise<GeneralChatOutput> {
  console.log('[generalChat] Initiated with input:', JSON.stringify(input, null, 2));
  const result = await generalChatFlow(input);
  console.log('[generalChat] Concluded with result:', JSON.stringify(result, null, 2));
  return result;
}

const getVisaOptionsTool = ai.defineTool(
  {
    name: 'getVisaOptionsTool',
    description: 'Retrieves visa options based on a given budget and background. This tool provides the raw visa data. Only use this tool if the user has explicitly provided both their budget AND background information within the current conversation turn or recent history. Do not guess or infer these values.',
    inputSchema: z.object({
      budget: z.number().describe('The budget for the visa in USD, explicitly stated by the user.'),
      background: z.string().describe('The background of the user (education, work experience), explicitly stated by the user.'),
    }),
    outputSchema: z.array(z.object({ // Mirroring VisaOption structure
      name: z.string(),
      cost: z.object({ usd: z.number() }),
      requirements: z.object({ minimumEducation: z.string(), minimumWorkExperience: z.string() }),
      processingTime: z.string(),
      successRate: z.number(),
    })).describe('Array of visa options matching the criteria.'),
  },
  async (toolInput) => {
    console.log(`[getVisaOptionsTool] Tool called with budget: ${toolInput.budget}, background: "${toolInput.background}"`);
    try {
      const options = await getVisaOptions(toolInput.budget, toolInput.background);
      console.log(`[getVisaOptionsTool] Tool returning ${options.length} options:`, JSON.stringify(options));
      return options;
    } catch (error) {
      console.error(`[getVisaOptionsTool] Error in tool execution:`, error);
      return []; // Return empty array on error to prevent flow crash
    }
  }
);

const fetchAndAnalyzeWebInformationTool = ai.defineTool(
  {
    name: 'fetchAndAnalyzeWebInformationTool',
    description: 'Fetches and analyzes content from the web to answer questions requiring real-time data, recent statistics, or specific details not in general knowledge. Use this for queries like "visa success rates for X country", "latest immigration policy changes for Y", or "economic outlook for Z for immigrants". You MUST provide a clear, specific query to this tool.',
    inputSchema: z.object({
      query: z.string().describe('A clear, specific question or topic for web research. E.g., "Current visa approval statistics for UK skilled worker visa for software engineers 2024" or "Impact of new German immigration law on student visas".'),
    }),
    outputSchema: z.object({
      analysisSummary: z.string().describe('A concise summary of the information found from relevant web pages, directly addressing the query. If no relevant information is found, or pages are inaccessible, or summarization fails, this will indicate that clearly (e.g., "Could not find relevant information for the query...", "Failed to access web sources for the query..."). This summary should be suitable for direct inclusion in the `webAnalysisContext` output field if the search was meaningful.'),
      sourceUrlsUsed: z.array(z.string().url()).optional().describe('List of URLs from which information was primarily extracted, if successful.')
    }),
  },
  async (toolInput) => {
    let analysisSummary = `Could not find relevant information for the query: "${toolInput.query}".`; // Default pessimistic summary
    const sourceUrlsUsed: string[] = [];
    console.log(`[fetchAndAnalyzeWebInformationTool] Tool initiated with query: "${toolInput.query}"`);

    try {
      console.log('[fetchAndAnalyzeWebInformationTool] Attempting URL suggestion.');
      const urlSuggestionPrompt = ai.definePrompt({
        name: 'urlSuggestionForWebSearch',
        input: { schema: z.object({ query: z.string() }) },
        output: { schema: z.object({ urls: z.array(z.string().url()).optional(), reasoning: z.string().optional() }) },
        prompt: `Based on the query: "{{query}}", identify up to 2 highly relevant and authoritative URLs (e.g., official government immigration websites, major reputable news outlets, respected international organizations) that are most likely to contain specific, up-to-date information. Prioritize official sources.

        Provide the URLs as a list. Also provide a brief reasoning why these URLs were chosen.
        If no specific URLs come to mind or if the query is too broad for specific URLs, return an empty list for URLs and state why.
        Query: "{{query}}"
        `,
        model: 'googleai/gemini-2.0-flash',
        config: { temperature: 0.3 }
      });
      
      const { output: urlSuggestionOutput } = await urlSuggestionPrompt({ query: toolInput.query });
      console.log(`[fetchAndAnalyzeWebInformationTool] URL suggestions received:`, urlSuggestionOutput);

      if (urlSuggestionOutput && urlSuggestionOutput.urls && urlSuggestionOutput.urls.length > 0) {
        const extractedContents: WebContentExtractorOutput[] = [];
        console.log(`[fetchAndAnalyzeWebInformationTool] Found ${urlSuggestionOutput.urls.length} potential URLs. Processing up to 2.`);
        
        for (const url of urlSuggestionOutput.urls.slice(0, 2)) { // Process max 2 URLs
          console.log(`[fetchAndAnalyzeWebInformationTool] Attempting to extract content from: ${url}`);
          try {
            const extractionResult = await extractWebContent({ 
              url, 
              extractionGoal: `Extract information relevant to the query: "${toolInput.query}" from the webpage at ${url}. Focus on factual data, key points, and summaries directly addressing the query.`
            });
            extractedContents.push(extractionResult);
            if (extractionResult.extractedInfo && !extractionResult.extractedInfo.toLowerCase().includes("error fetching page") && !extractionResult.extractedInfo.toLowerCase().includes("could not be found")) {
               sourceUrlsUsed.push(url);
            }
            console.log(`[fetchAndAnalyzeWebInformationTool] Extraction result from ${url}:`, extractionResult.extractedInfo.substring(0, 200) + "...");
          } catch (e: any) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error(`[fetchAndAnalyzeWebInformationTool] Error extracting content from ${url}:`, errorMessage);
            extractedContents.push({ extractedInfo: `Error during extraction from ${url}: ${errorMessage}`, sourceUrl: url });
          }
        }

        const successfulExtractions = extractedContents.filter(
          content => content.extractedInfo && 
                     !content.extractedInfo.toLowerCase().includes("error fetching page") &&
                     !content.extractedInfo.toLowerCase().includes("could not be found") &&
                     !content.extractedInfo.toLowerCase().includes("error during extraction") &&
                     content.extractedInfo.trim() !== ''
        ).map(content => `Source: ${content.sourceUrl}\nContent: ${content.extractedInfo}`);

        console.log(`[fetchAndAnalyzeWebInformationTool] Texts collected for summarization (Successful extractions: ${successfulExtractions.length})`);

        if (successfulExtractions.length > 0) {
           console.log('[fetchAndAnalyzeWebInformationTool] Attempting to run final summary LLM.');
           const finalSummaryPrompt = ai.definePrompt({
            name: 'summarizeWebExtractionsForChat',
            input: { schema: z.object({ query: z.string(), texts: z.array(z.string()) }) },
            output: { schema: z.object({ summary: z.string() }) },
            prompt: `Original query: "{{query}}"
            Extracted information from web sources:
            {{#each texts}}
            {{{this}}}
            ---
            {{/each}}
            Synthesize these texts into a concise, analytical summary that directly answers or addresses the original query. 
            If the texts predominantly indicate an inability to find information or access issues, CLEARLY STATE that the information could not be retrieved and briefly explain why.
            If no specific information related to the query is found in the texts, state that clearly.
            Your summary MUST be comprehensive and directly address the query. Do not be vague.
            `,
            model: 'googleai/gemini-2.0-flash',
            config: { temperature: 0.5 }
          });
          const {output: summaryOutput} = await finalSummaryPrompt({ query: toolInput.query, texts: successfulExtractions });
          console.log(`[fetchAndAnalyzeWebInformationTool] Final summary LLM output received:`, summaryOutput);

          if(summaryOutput && summaryOutput.summary && summaryOutput.summary.trim() !== '') {
            analysisSummary = summaryOutput.summary;
          } else {
            analysisSummary = `Information was extracted from web sources for the query "${toolInput.query}", but the final summarization step did not produce a usable summary. The extracted content might have been insufficient or unclear.`;
            console.warn(`[fetchAndAnalyzeWebInformationTool] Summarization LLM failed or returned empty for query: "${toolInput.query}"`);
          }
        } else {
          analysisSummary = `Could not extract usable information from the suggested web sources for the query: "${toolInput.query}". All attempted sources might have been inaccessible, returned errors, or contained no relevant content.`;
          console.warn(`[fetchAndAnalyzeWebInformationTool] No successful extractions for query: "${toolInput.query}"`);
        }
      } else {
        analysisSummary = `Could not identify specific authoritative URLs for the query: "${toolInput.query}". ${urlSuggestionOutput?.reasoning || 'The query might be too broad or no URLs were suggested by the initial search.'}`;
        console.warn(`[fetchAndAnalyzeWebInformationTool] No URL suggestions for query: "${toolInput.query}"`);
      }
    } catch (error) {
      console.error("[fetchAndAnalyzeWebInformationTool] Critical error in tool execution:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      analysisSummary = `An unexpected critical error occurred within the web analysis tool while processing the query "${toolInput.query}". Details: ${errorMessage}`;
    }
    
    const finalToolOutput = { 
      analysisSummary: analysisSummary.trim(), 
      sourceUrlsUsed: sourceUrlsUsed.length > 0 ? sourceUrlsUsed : undefined 
    };
    console.log(`[fetchAndAnalyzeWebInformationTool] Concluding. Final tool output for query "${toolInput.query}": ${JSON.stringify(finalToolOutput, null, 2)}`);
    return finalToolOutput;
  }
);


const chatPrompt = ai.definePrompt({
  name: 'generalChatJapaGeniePrompt',
  input: { schema: GeneralChatInputSchema },
  output: { schema: GeneralChatOutputSchema },
  prompt: `You are Japa Genie, a seasoned and highly knowledgeable visa coach. Your tone is empathetic, insightful, and practical. You're known for your ability to break down complex visa situations into understandable advice and for providing tips that go beyond generic information. Engage naturally with the user. Your responses MUST be detailed and comprehensive.

Current conversation:
{{#each chatHistory}}
  {{role}}: {{parts.0.text}}
{{/each}}
User: {{{currentMessage}}}
Japa Genie:

Your primary goal is to have a helpful conversation and guide the user effectively.

**Initial Engagement & Information Gathering:**
- If the conversation is new (i.e., 'chatHistory' is empty or very short and user's message is a greeting or general query) or lacks key details (like the user's name, general background, or specific visa interests/destination), be proactive in a friendly way. For example:
    - "Welcome! I'm Japa Genie, your AI visa coach. To help you best, could you tell me a bit about your goals? For example, what's your name, and are you exploring options for a specific country or type of visa?"
    - "I can certainly help with that. To start, could you share your name and perhaps a little about what you're looking to achieve with a visa?"
- If the user has provided some initial information but key details like budget, background (education/work), or specific countries of interest are missing for visa recommendations, gently ask for them. For example: "Thanks for sharing that, [User's Name (if known)]! To help me find suitable visa options or provide more specific advice, could you tell me about your budget for this process, and a bit about your educational background and work experience?"
- Remember this information and use it to make the conversation more personal and effective.

**Contextual Memory and Follow-up Questions:**
- You **MUST** refer to the 'chatHistory' to understand the ongoing conversation. This is critical for providing relevant and coherent responses.
- **If you have presented \`visaRecommendations\` or \`webAnalysisContext\` in a recent turn (within the last 2-3 model responses in 'chatHistory') and the current user query directly relates to or continues the discussion about that specific information, you SHOULD re-include the *original, unchanged* \`visaRecommendations\` data or \`webAnalysisContext\` string in your current output object. This ensures the user can still see the relevant structured data in the display panel. Your \`conversationalReply\` should still naturally continue the discussion.**
- If the user asks a question about one of the *recently presented* visa recommendations or a related process (e.g., 'Tell me more about the Canadian Tech Talent Stream'), use the information from that recommendation as context for your \`conversationalReply\` and re-include the full \`visaRecommendations\` array (if it was presented recently and is still the active context) in your output.
- Do not use the \`getVisaOptionsTool\` or \`fetchAndAnalyzeWebInformationTool\` again for the *exact same query or context* if you have successfully provided results for it very recently. Instead, refer to and re-emit the previous results if appropriate for the current conversational turn.
- If the user's follow-up is ambiguous (e.g., 'What about the first one?'), ask for clarification based on what you recently presented. For example: "To clarify, are you referring to the [Name of first visa option from history] or something else?"
- When presenting information, clearly state how it's being delivered (e.g., in this conversational reply, or as structured data in the 'visaRecommendations' or 'webAnalysisContext' fields which will be displayed separately). Do not refer to generic UI elements you cannot directly populate through these structured fields.

**Tool Usage Instructions:**

1.  **Web Analysis (fetchAndAnalyzeWebInformationTool):**
    *   IF the user asks for information that clearly requires up-to-date web knowledge (e.g., "current visa success rates for X", "latest policy changes for Y", "economic outlook for Z for immigrants", "news about immigration in country A"), you **MUST** use the 'fetchAndAnalyzeWebInformationTool'.
    *   You **MUST** provide a clear, specific query to the tool's 'query' input.
    *   After the tool runs, it will return an 'analysisSummary'.
        *   If the 'analysisSummary' from the tool contains useful information (even if it's partial or includes caveats like "specific data was hard to find but here's a general trend"), you **MUST** incorporate the core findings into your 'conversationalReply' in a natural way. You **MUST** also populate the 'webAnalysisContext' field in your output with this 'analysisSummary'. The \`webAnalysisContext\` field is crucial for displaying these findings to the user separately.
        *   If the 'analysisSummary' indicates a *complete* failure (e.g., "Could not find any relevant information at all", "Failed to access all web sources", "Summarization tool itself failed critically"), you **MUST** explain this outcome to the user in your 'conversationalReply'. In this case of complete tool failure, the 'webAnalysisContext' field **MUST BE OMITTED** from your output object (or can be explicitly set to null by you, which the system will treat as omitted). Do not populate 'webAnalysisContext' with messages that only indicate a complete lack of results from the tool.
    *   Always guide the conversation forward after presenting web analysis results or explaining a search failure.

2.  **Visa Recommendations (getVisaOptionsTool):**
    *   IF the user asks for visa recommendations, OR if they mention their budget AND background details during the conversation, OR if the conversation context strongly implies they are ready for visa options after discussing budget/background:
        1.  You **MUST** use the 'getVisaOptionsTool' to fetch a list of potentially suitable visa options. Do not try to answer from memory if you can use the tool.
        2.  After receiving the visa options from the tool, you **MUST** populate the 'visaRecommendations' field in your output. This field should be an array of objects, where each object represents a visa and includes:
            - 'name' (string): The name of the visa.
            - 'cost' (object): With a 'usd' (number) field.
            - 'requirements' (object): With 'minimumEducation' (string) and 'minimumWorkExperience' (string) fields.
            - 'processingTime' (string): The processing time.
            - 'successRate' (number): The success rate percentage for a similar profile.
            - 'reason' (string, optional but highly encouraged): Your DETAILED, coach-like reason why this visa is recommended. Explain clearly, offer practical tips, strategic advice, potential benefits, or common pitfalls. Your language should be encouraging and empowering. Aim for comprehensive explanations.
            Aim for at most 3 recommendations. If no visas are found or suitable, 'visaRecommendations' should be an empty array or omitted.
        3.  Your 'conversationalReply' **MUST** then briefly acknowledge that you've found some options (e.g., "Okay, I've looked into that for you and found some potential visa options. You can see the details on the right, including the estimated success rates. Which of these interests you the most, or would you like to discuss how they compare?") and offer to discuss them further or ask a clarifying question to guide the user. The reply should be detailed and natural.

**General Conversation:**
- IF the conversation is NOT about visa recommendations and does not require web search:
  - Simply provide a helpful, DETAILED, and conversational response in the 'conversationalReply' field.
  - If there are no visa recommendations relevant to the current turn (even if some were provided earlier but are no longer the immediate topic), the 'visaRecommendations' field should be an empty array or omitted for this turn.
  - If web analysis was not performed for the current turn, the 'webAnalysisContext' field **MUST be omitted** from the output object (or set to null).
  - Always try to end your conversational turns in a way that invites the user to continue or makes it clear what they can do next. For example: "What are your thoughts on this?" or "Is there anything else I can help you with regarding this topic?" or "What's the next step you're considering?"

**Important Guidelines:**
- Ensure your 'conversationalReply' is always populated and is DETAILED and COMPREHENSIVE.
- If 'visaRecommendations' are generated (or re-emitted as per contextual memory guidelines), they MUST conform to the schema, especially the 'reason' field which should be thorough.
`,
  tools: [getVisaOptionsTool, fetchAndAnalyzeWebInformationTool],
  model: 'googleai/gemini-2.0-flash',
  config: {
    temperature: 0.6, 
  }
});


const generalChatFlow = ai.defineFlow(
  {
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
  },
  async (input: GeneralChatInput): Promise<GeneralChatOutput> => {
    console.log('[generalChatFlow] Flow starting with input:', JSON.stringify(input, null, 2));
    let output: GeneralChatOutput | null = null;
    try {
      console.log('[generalChatFlow] About to call chatPrompt.');
      const promptResponse = await chatPrompt(input);
      output = promptResponse.output;
      console.log('[generalChatFlow] Received raw output from chatPrompt:', JSON.stringify(output, null, 2));
    } catch (error: any) {
        console.error('[generalChatFlow] Error calling chatPrompt:', error);
        if (error.stack) {
          console.error('[generalChatFlow] Error stack:', error.stack);
        }
        if (error.details) {
          console.error('[generalChatFlow] Error details:', JSON.stringify(error.details, null, 2));
        }
        return {
          conversationalReply: "I'm sorry, I encountered an issue while processing your request. Please try again in a moment.",
          visaRecommendations: [],
        };
    }
    

    if (!output) {
      console.error('[generalChatFlow] No output received from chatPrompt. This is unexpected.');
      return {
        conversationalReply: "I'm sorry, I encountered an issue and can't respond right now. Please try again in a moment.",
        visaRecommendations: [],
      };
    }

    const conversationalReply = output.conversationalReply || "I'm sorry, I couldn't formulate a response at this time. Please try rephrasing your message.";
    
    // Ensure visaRecommendations is an array, even if AI omits it or sends null/undefined
    const visaRecommendations = Array.isArray(output.visaRecommendations) ? output.visaRecommendations : [];
    
    let finalWebAnalysisContext: string | null | undefined = undefined;
    if (output.webAnalysisContext === null) {
      finalWebAnalysisContext = null; // Explicitly set to null if AI returns null
       console.log("[generalChatFlow] AI returned null for webAnalysisContext. Passing as null (will be omitted by UI if null).");
    } else if (output.webAnalysisContext && typeof output.webAnalysisContext === 'string' && output.webAnalysisContext.trim() !== '') {
      // Check if the context is just a generic failure message from the tool itself (which should be omitted)
      const failureKeywords = [
        "could not find relevant information for the query", 
        "failed to access web sources for the query", 
        "summarization failed",
        "unable to retrieve", 
        "could not identify specific authoritative urls", 
        "no successful extractions", 
        "an unexpected critical error occurred",
        "did not produce a usable summary",
        "did not yield a clear, concise summary"
      ];
      const providedContextLower = output.webAnalysisContext.toLowerCase();
      
      // A more robust check: if it contains failure keywords AND is relatively short, it's likely a tool failure message.
      // The AI's instruction is to OMIT webAnalysisContext on complete tool failure. This check is a safeguard.
      const isClearlyTotalFailureMessage = failureKeywords.some(keyword => providedContextLower.includes(keyword.toLowerCase())) && output.webAnalysisContext.length < 200;


      if (isClearlyTotalFailureMessage) {
        finalWebAnalysisContext = undefined; // Treat as omitted if it's just a failure message
        console.log(`[generalChatFlow] webAnalysisContext from AI indicates failure or no meaningful content ("${output.webAnalysisContext.substring(0,100)}..."). Omitting from final output.`);
      } else {
        finalWebAnalysisContext = output.webAnalysisContext.trim();
        console.log(`[generalChatFlow] Using webAnalysisContext from AI: "${finalWebAnalysisContext.substring(0,100)}..."`);
      }
    } else {
       console.log("[generalChatFlow] webAnalysisContext is empty, null, or not provided by AI. Setting to undefined (will be omitted by UI).");
       finalWebAnalysisContext = undefined;
    }


    const finalResult: GeneralChatOutput = {
      conversationalReply,
      visaRecommendations, // This will be an empty array if AI didn't provide any
      webAnalysisContext: finalWebAnalysisContext, 
    };
    console.log('[generalChatFlow] Final processed output to be returned:', JSON.stringify(finalResult, null, 2));
    return finalResult;
  }
);
