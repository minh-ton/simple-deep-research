import { createOpenAI } from '@ai-sdk/openai';
import { getEncoding, TiktokenEncoding } from 'js-tiktoken';
import {
  OPENAI_MODEL,
  OPENAI_MODEL_TOKEN_LIMIT,
  TIKTOKEN_ENCODING,
} from '../../constant-config.json';

const config = {
  encoding: TIKTOKEN_ENCODING as TiktokenEncoding,
  model: OPENAI_MODEL,
  maxTokensLimit: OPENAI_MODEL_TOKEN_LIMIT,
  minChunkSize: 1024, // ~340 tokens to keep richer context, useful for longer prompts
  charsPerToken: 3,
} as const;

const encoder = getEncoding(config.encoding);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const modelConfig = openai(config.model, {
  structuredOutputs: true,
});

export function trimPrompt(prompt: string): string {
  const tokenCount = encoder.encode(prompt).length;
  if (tokenCount <= config.maxTokensLimit) return prompt;

  // Trim the prompt to the minimum length required to fit within the token limit
  // while ensuring that the prompt is at least `minChunkSize` characters long.
  const minTrimmedLength = Math.max(
    prompt.length - (tokenCount - config.maxTokensLimit) * config.charsPerToken,
    config.minChunkSize,
  );

  return prompt.slice(0, minTrimmedLength);
}
