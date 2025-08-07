
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
    try {
      const searchResult = await ai.prompt(`Summarize web search results for the query: "${toolInput.query}"`);
      return { analysisSummary: searchResult };
    } catch (error) {
      console.error("[fetchAndAnalyzeWebInformationTool] Critical error in tool execution:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { analysisSummary: `An unexpected critical error occurred while searching the web. Details: ${errorMessage}` };
    }
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

**Tool Usage Instructions:**

1.  **Web Analysis (fetchAndAnalyzeWebInformationTool):**
    *   IF the user asks for information that clearly requires up-to-date web knowledge (e.g., "current visa success rates for X", "latest policy changes for Y", "economic outlook for Z for immigrants", "news about immigration in country A"), you **MUST** use the 'fetchAndAnalyzeWebInformationTool'.
    *   You **MUST** provide a clear, specific query to the tool's 'query' input.
    *   After the tool runs, it will return an 'analysisSummary'.
        *   If the 'analysisSummary' from the tool contains useful information, you **MUST** incorporate the core findings into your 'conversationalReply' and populate the 'webAnalysisContext' field in your output with this 'analysisSummary'.
        *   If the 'analysisSummary' indicates a failure, you **MUST** explain this outcome to the user in your 'conversationalReply'. In this case, the 'webAnalysisContext' field **MUST BE OMITTED** from your output object.

2.  **Visa Recommendations (getVisaOptionsTool):**
    *   IF the user asks for visa recommendations and provides their budget and background, you **MUST** use the 'getVisaOptionsTool'.
    *   After receiving the visa options from the tool, you **MUST** populate the 'visaRecommendations' field in your output.
    *   Your 'conversationalReply' **MUST** then briefly acknowledge that you've found some options and offer to discuss them further.

**General Conversation:**
- IF the conversation does not require using a tool, simply provide a helpful, DETAILED, and conversational response in the 'conversationalReply' field.

**Important Guidelines:**
- Ensure your 'conversationalReply' is always populated and is DETAILED and COMPREHENSIVE.
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
    try {
      const promptResponse = await chatPrompt(input);
      const output = promptResponse.output;

      if (!output) {
        throw new Error("No output received from chatPrompt.");
      }

      return {
        conversationalReply: output.conversationalReply || "I'm sorry, I couldn't formulate a response at this time. Please try rephrasing your message.",
        visaRecommendations: output.visaRecommendations || [],
        webAnalysisContext: output.webAnalysisContext,
      };
    } catch (error) {
      console.error('[generalChatFlow] Error:', error);
      return {
        conversationalReply: "I'm sorry, I encountered an issue while processing your request. Please try again in a moment.",
        visaRecommendations: [],
      };
    }
  }
);
