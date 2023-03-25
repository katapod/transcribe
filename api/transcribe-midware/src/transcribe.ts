import { OpenAI } from './openai';

import type { FileData } from '../../../app/src/services/transcriber';
import { StripeAPI } from './stripe';
import { Env } from '.';

export async function transcribe({
  file,
  fileData,
  env,
}: {
  file: any;
  fileData: FileData;
  env: Env;
}) {
  const openAI = new OpenAI({
    apiKey: env.OPEN_AI_API_KEY,
  });

  const stripe = new StripeAPI({ env, userInfo: { supabaseId: fileData.userId } });
  await stripe.initialise();
  await stripe.recordUsage({
    quantity: Math.ceil(fileData.duration),
    idempotencyKey: fileData.idempotencyKey,
  });

  const text = await openAI.transcribeAudio(file, {
    prompt: fileData.prompt,
  });

  await stripe.storeTranscription({
    fileData,
    transcription: text,
  });

  return text;
}
