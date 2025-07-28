
import axios from 'axios';

const AXIOS_TIMEOUT = 15000; // 15 seconds timeout

/**
 * Fetches the raw HTML content of a webpage.
 * @param url The URL of the webpage to fetch.
 * @returns A promise that resolves to the HTML content as a string.
 * @throws Will throw an error if the request fails or the URL is invalid.
 */
export async function fetchWebpageHtml(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        // Some websites might block requests without a common user-agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: AXIOS_TIMEOUT, // Added timeout
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error(`Timeout fetching URL ${url} after ${AXIOS_TIMEOUT / 1000} seconds.`);
        throw new Error(`Failed to fetch content from ${url} due to a timeout.`);
      }
      console.error(`Error fetching URL ${url}: ${error.message}`);
      throw new Error(`Failed to fetch content from ${url}. Status: ${error.response?.status}`);
    } else {
      console.error(`An unexpected error occurred while fetching ${url}:`, error);
      throw new Error(`An unexpected error occurred while fetching ${url}.`);
    }
  }
}
