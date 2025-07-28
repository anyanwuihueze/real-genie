
'use server';
/**
 * @fileOverview AI flow for providing visa recommendations based on user budget and background.
 *
 * - visaRecommendation - A function that takes user's budget and background and returns personalized visa recommendations.
 * - VisaRecommendationInput - The input type for the visaRecommendation function.
 * - VisaRecommendationOutput - The return type for the visaRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getVisaOptions, VisaOption} from '@/services/visa-options';

const VisaRecommendationInputSchema = z.object({
  budget: z.number().describe('The budget for the visa in USD.'),
  background: z.string().describe('The background of the user, including education and work experience.'),
  travelPreferences: z.string().optional().describe('Optional travel preferences of the user.'),
});
export type VisaRecommendationInput = z.infer<typeof VisaRecommendationInputSchema>;

const VisaRecommendationOutputSchema = z.array(z.object({
  name: z.string().describe('The name of the visa.'),
  cost: z.object({
    usd: z.number().describe('The cost in USD.'),
  }).describe('The cost of the visa.'),
  requirements: z.object({
    minimumEducation: z.string().describe('The minimum education level required.'),
    minimumWorkExperience: z.string().describe('The minimum work experience required.'),
  }).describe('The requirements for the visa.'),
  processingTime: z.string().describe('The processing time for the visa.'),
  successRate: z.number().describe('The estimated success rate for a candidate with a similar profile, as a percentage (e.g., 85 for 85%).'),
  reason: z.string().describe('The detailed, coach-like reason why this visa is recommended, including insightful tips, potential strategies, or important considerations. This should reflect the persona of a seasoned visa coach.'),
}));
export type VisaRecommendationOutput = z.infer<typeof VisaRecommendationOutputSchema>;

export async function visaRecommendation(input: VisaRecommendationInput): Promise<VisaRecommendationOutput> {
  return visaRecommendationFlow(input);
}

const getVisaOptionsTool = ai.defineTool(
  {
    name: 'getVisaOptions',
    description: 'Retrieves visa options based on a given budget and background. This tool provides the raw visa data.',
    inputSchema: z.object({
      budget: z.number().describe('The budget for the visa.'),
      background: z.string().describe('The background of the user.'),
    }),
    outputSchema: z.array(z.object({
      name: z.string().describe('The name of the visa.'),
      cost: z.object({
        usd: z.number().describe('The cost in USD.'),
      }).describe('The cost of the visa.'),
      requirements: z.object({
        minimumEducation: z.string().describe('The minimum education level required.'),
        minimumWorkExperience: z.string().describe('The minimum work experience required.'),
      }).describe('The requirements for the visa.'),
      processingTime: z.string().describe('The processing time for the visa.'),
      successRate: z.number().describe('The estimated success rate for a candidate with a similar profile, as a percentage (e.g., 85 for 85%).'),
    })).describe('Array of visa options'),
  },
  async (input) => {
    return getVisaOptions(input.budget, input.background);
  }
);

const prompt = ai.definePrompt({
  name: 'visaRecommendationPrompt',
  input: {schema: VisaRecommendationInputSchema},
  output: {schema: VisaRecommendationOutputSchema},
  prompt: `You are Japa Genie, a seasoned and highly knowledgeable visa coach. Your tone is empathetic, insightful, and practical. You're known for your ability to break down complex visa situations into understandable advice and for providing tips that go beyond generic information. You always operate ethically and legally, but you're skilled at highlighting strategic advantages or "loopholes" (in the sense of clever, legitimate strategies) within visa programs.

A user will provide their budget, background, and travel preferences.
User's Budget: {{budget}} USD
User's Background: {{{background}}}
User's Travel Preferences: {{{travelPreferences}}}

First, you MUST use the 'getVisaOptionsTool' to fetch a list of potentially suitable visa options based on the user's raw budget and background. This tool will give you the factual data about visas (name, cost, basic requirements, processing time, success rate).

After receiving the visa options from the tool, your main task is to analyze each option and provide a detailed, coach-like "reason" for why it might be a good fit (or things to watch out for). Your reasoning should be the core of your response.

For each recommended visa, in the 'reason' field, you should:
- Explain clearly why this visa aligns with the user's profile and mention its success rate as a key factor.
- Offer practical tips or strategic advice related to this visa. For example, if a visa has a quicker processing time under certain conditions, mention it. If certain types of experience are valued more, highlight that.
- Point out any potential benefits or strategic advantages (e.g., pathways to permanent residency, flexibility for family members, less common but valuable perks).
- If there are common pitfalls or important considerations for this visa, gently guide the user.
- Your language should be encouraging and empowering. Avoid jargon where possible, or explain it clearly.

Format your output as an array of visa objects, adhering to the output schema. The most important part is the 'reason' field for each visa, where your coaching expertise shines. If no visas are returned by the tool, or none seem truly suitable even after your expert analysis, return an empty array.
`,
  tools: [getVisaOptionsTool],
});


const visaRecommendationFlow = ai.defineFlow(
  {
    name: 'visaRecommendationFlow',
    inputSchema: VisaRecommendationInputSchema,
    outputSchema: VisaRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null, and if it is, return an empty array to match schema.
    return output || [];
  }
);
