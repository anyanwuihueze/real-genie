
'use server';
/**
 * @fileOverview AI flow for extracting targeted information from a webpage.
 *
 * - extractWebContent - A function that takes a URL and an extraction goal,
 *   fetches the page content, and uses an LLM to extract the relevant information.
 * - WebContentExtractorInput - The input type for the extractWebContent function.
 * - WebContentExtractorOutput - The return type for the extractWebContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { fetchWebpageHtml } from '@/services/web-fetcher';

const WebContentExtractorInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to process.'),
  extractionGoal: z.string().min(10).describe('A clear description of the information to be extracted from the webpage content. E.g., "Extract the main contact email address" or "Summarize the key services offered."'),
});
export type WebContentExtractorInput = z.infer<typeof WebContentExtractorInputSchema>;

const WebContentExtractorOutputSchema = z.object({
  extractedInfo: z.string().describe('The extracted information based on the goal, or a statement if the information could not be found.'),
  sourceUrl: z.string().url().describe('The source URL from which the information was attempted to be extracted.'),
});
export type WebContentExtractorOutput = z.infer<typeof WebContentExtractorOutputSchema>;

export async function extractWebContent(input: WebContentExtractorInput): Promise<WebContentExtractorOutput> {
  return webContentExtractorFlow(input);
}

const fetchWebpageContentTool = ai.defineTool(
  {
    name: 'fetchWebpageContentTool',
    description: 'Fetches the raw HTML content of a given webpage URL.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL of the webpage to fetch.'),
    }),
    outputSchema: z.object({
      htmlContent: z.string().describe('The raw HTML content of the webpage.'),
    }),
  },
  async (input) => {
    try {
      const html = await fetchWebpageHtml(input.url);
      return { htmlContent: html };
    } catch (e: any) {
      // It's important for the tool to return a structured error or indication
      // that the LLM can understand if fetching fails.
      return { htmlContent: `Error fetching page: ${e.message}` };
    }
  }
);

const extractionPrompt = ai.definePrompt({
  name: 'webContentExtractionPrompt',
  input: { schema: z.object({
    htmlContent: z.string(),
    extractionGoal: z.string(),
    url: z.string().url(),
  })},
  output: { schema: WebContentExtractorOutputSchema },
  prompt: `You are an expert web content analysis agent. Your task is to extract specific information from the provided HTML content of a webpage, based on a given goal.

Webpage URL: {{{url}}}
Extraction Goal: {{{extractionGoal}}}

HTML Content:
\`\`\`html
{{{htmlContent}}}
\`\`\`

Based on the HTML content and the extraction goal, provide the requested information.
If the HTML content indicates an error in fetching (e.g., starts with "Error fetching page:"), state that the page could not be accessed.
If the information cannot be found in the provided HTML, clearly state that. Be concise and directly address the extraction goal.
Return the extracted information in the 'extractedInfo' field and the original URL in the 'sourceUrl' field.
`,
  tools: [], // The tool is called by the flow, not directly by this prompt's LLM call
});

const webContentExtractorFlow = ai.defineFlow(
  {
    name: 'webContentExtractorFlow',
    inputSchema: WebContentExtractorInputSchema,
    outputSchema: WebContentExtractorOutputSchema,
  },
  async (input) => {
    // Step 1: Fetch the webpage content using the tool
    const toolOutput = await fetchWebpageContentTool({ url: input.url });

    // Step 2: Pass the fetched content and extraction goal to the LLM
    const {output} = await extractionPrompt({
      htmlContent: toolOutput.htmlContent,
      extractionGoal: input.extractionGoal,
      url: input.url,
    });
    
    if (!output) {
      throw new Error("Failed to get a response from the extraction prompt.");
    }
    return output;
  }
);
