import { generateObject } from 'ai';
import { z } from 'zod';

import { systemPrompt, extractInsightsPrompt } from '../prompts';
import { modelConfig, trimPrompt } from '../lib/aisdk';

const insightsSchema = z.object({
  relevance: z
    .string()
    .describe(
      "Respond with exactly one word: 'Yes' if the page is useful, or 'No' if it is not. Do not include any extra text.",
    ),
  insights: z
    .array(z.string())
    .describe(
      'Extracted insights from the webpage content (omit this if the webpage is not useful).',
    ),
  summary: z
    .string()
    .describe('A summary of the insights extracted from the webpage content.'),
});

export type InsightsResult = z.infer<typeof insightsSchema>;

export async function extractInsights(
  pageURL: string,
  pageContent: string,
  userSearchQuery: string,
): Promise<InsightsResult> {
  const response = await generateObject({
    model: modelConfig,
    system: systemPrompt(),
    prompt: trimPrompt(
      extractInsightsPrompt(pageURL, pageContent, userSearchQuery),
    ),
    schema: insightsSchema,
  });

  return response.object;
}
