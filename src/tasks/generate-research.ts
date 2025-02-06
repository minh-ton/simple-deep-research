import { generateObject } from 'ai';
import { z } from 'zod';

import { systemPrompt, generateResearchReportPrompt } from '../prompts';
import { modelConfig, trimPrompt } from '../lib/aisdk';

const reportSchema = z.object({
  report: z.string().describe('The generated Markdown research report.'),
});

export async function generateResearchReport(
  collectedLearnings: string[],
  userSearchQuery: string,
  preciseQueries: string[],
  followUpQuestions: string[],
): Promise<string> {
  const response = await generateObject({
    model: modelConfig,
    system: systemPrompt(),
    prompt: trimPrompt(
      generateResearchReportPrompt(
        collectedLearnings,
        userSearchQuery,
        preciseQueries,
        followUpQuestions,
      ),
    ),
    schema: reportSchema,
  });

  return response.object.report;
}
