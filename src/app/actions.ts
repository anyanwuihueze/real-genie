
// @ts-nocheck
// TODO: Fix TS errors
"use server";

import { visaRecommendation, type VisaRecommendationInput, type VisaRecommendationOutput } from "@/ai/flows/visa-recommendation";
import { extractWebContent, type WebContentExtractorInput, type WebContentExtractorOutput } from "@/ai/flows/web-content-extractor";
import { generalChat, type GeneralChatInput, type GeneralChatOutput } from "@/ai/flows/general-chat-flow";

interface VisaActionResult {
  success: boolean;
  data?: VisaRecommendationOutput;
  error?: string;
}

export async function getVisaRecommendationsAction(input: VisaRecommendationInput): Promise<VisaActionResult> {
  try {
    const recommendations = await visaRecommendation(input);
    return { success: true, data: recommendations };
  } catch (error) {
    console.error("Error getting visa recommendations:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." };
  }
}

interface WebExtractActionResult {
  success: boolean;
  data?: WebContentExtractorOutput;
  error?: string;
}

export async function extractWebContentAction(input: WebContentExtractorInput): Promise<WebExtractActionResult> {
  try {
    const result = await extractWebContent(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error extracting web content:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." };
  }
}

interface GeneralChatActionResult {
  success: boolean;
  data?: GeneralChatOutput;
  error?: string;
}

export async function generalChatAction(input: GeneralChatInput): Promise<GeneralChatActionResult> {
  try {
    const result = await generalChat(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in general chat:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." };
  }
}
