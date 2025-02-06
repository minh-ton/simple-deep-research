import { generateObject } from 'ai';
import { z } from 'zod';

import { systemPrompt, assessSufficiencyPrompt } from '../prompts';
import { modelConfig, trimPrompt } from '../lib/aisdk';

const sufficiencySchema = z.object({
  summary: z.object({
    sufficiencyAssessment: z
      .string()
      .describe('A brief summary of the sufficiency assessment.'),
    additionalQueries: z
      .array(z.string())
      .describe('A list of additional search queries (if needed).'),
  }),
});

type SufficiencyResponse = z.infer<typeof sufficiencySchema>;

export async function assessSufficiency(
  collectedLearnings: string[],
  userSearchQuery: string,
  preciseQueries: string[],
): Promise<SufficiencyResponse['summary']> {
  const response = await generateObject({
    model: modelConfig,
    system: systemPrompt(),
    prompt: trimPrompt(
      assessSufficiencyPrompt(
        collectedLearnings,
        userSearchQuery,
        preciseQueries,
      ),
    ),
    schema: sufficiencySchema,
  });

  return response.object.summary;
}
