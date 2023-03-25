export interface OpenAIConfig {
  apiKey: string;
}

export interface OpenAITranscriptionResponse {
  text: string;
}

export class OpenAI {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1/audio/transcriptions';
  private readonly transcribeModel = 'whisper-1';
  constructor({ apiKey }: OpenAIConfig) {
    this.apiKey = apiKey;
  }

  async transcribeAudio(file: File, model = this.transcribeModel): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

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
