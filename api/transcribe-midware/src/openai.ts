export interface OpenAIConfig {
  apiKey: string;
}

export interface OpenAITranscriptionResponse {
  text: string;
}

export interface TranscribeOptions {
  model?: string;
  prompt?: string;
}

export class OpenAI {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1/audio/transcriptions';
  private readonly transcribeModel = 'whisper-1';
  constructor({ apiKey }: OpenAIConfig) {
    this.apiKey = apiKey;
  }

  async transcribeAudio(
    file: any,
    { model = this.transcribeModel, prompt }: TranscribeOptions,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

    if (prompt) {
      formData.append('prompt', prompt);
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const data = (await response.json()) as OpenAITranscriptionResponse;
    return data.text;
  }
}
