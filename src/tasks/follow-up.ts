import { generateObject } from 'ai';
import { z } from 'zod';
import { systemPrompt, generateFollowUpPrompt } from '../prompts';
import { modelConfig, trimPrompt } from '../lib/aisdk';

const questionSchema = z.object({
  questions: z
    .array(z.string())
    .describe(
      'A list of follow-up questions that would help clarify any ambiguities or refine the research direction.',
    ),
});

export async function generateFollowUpQuestions(
  userSearchQuery: string,
): Promise<string[]> {
  const response = await generateObject({
    model: modelConfig,
    system: systemPrompt(),
    prompt: trimPrompt(generateFollowUpPrompt(userSearchQuery)),
    schema: questionSchema,
  });

  return response.object.questions;
}
