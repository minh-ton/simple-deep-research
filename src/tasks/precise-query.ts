import { generateObject } from 'ai';
import { z } from 'zod';

import { systemPrompt, generatePreciseQueryPrompt } from '../prompts';
import { modelConfig, trimPrompt } from '../lib/aisdk';

const querySchema = z.object({
  queries: z
    .array(z.string().describe('The query.'))
    .describe('A list of precise and targeted search queries.'),
});

export async function generatePreciseQueries(
  userSearchQuery: string,
  followUpQuestions: string[],
  collectedLearnings: string[],
): Promise<string[]> {
  const response = await generateObject({
    model: modelConfig,
    system: systemPrompt(),
    prompt: trimPrompt(
      generatePreciseQueryPrompt(
        userSearchQuery,
        followUpQuestions,
        collectedLearnings,
      ),
    ),
    schema: querySchema,
  });

  return response.object.queries;
}
