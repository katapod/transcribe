import log from 'loglevel';
import { v4 as uuidv4 } from 'uuid';

export interface TranscriberConfig {
  userId: string;
}

export interface TranscriberResponse {
  text: string;
}

export interface FileData {
  size: number;
  fileType: string;
  duration: number;
  userId: string;
  idempotencyKey: string;
  prompt?: string;
}

export interface PreparedFile {
  file: File;
  fileData: FileData;
}

export class Transcriber {
  private readonly transcribeModel = 'whisper-1';
  public userId: string;
  constructor({ userId }: TranscriberConfig) {
    this.userId = userId;
  }

  async transcribeAudio(
    file: File,
    {
      model = this.transcribeModel,
      prompt,
    }: {
      model?: string;
      prompt?: string;
    }
  ): Promise<string> {
    const preparedFile = await this.prepareFile(file);
    const fileData = preparedFile.fileData;

    if (prompt) {
      fileData.prompt = prompt;
    }

    const formData = new FormData();
    formData.append('file', preparedFile.file);
    formData.append('fileData', JSON.stringify(fileData));
    formData.append('model', model);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });
    log.debug(response);
    const data = (await response.json()) as TranscriberResponse;

    return data.text;
  }

  async prepareFile(file: File): Promise<PreparedFile> {
    const duration = await this.getDuration(file);
    const fileType = file.type;
    const size = file.size;

    const fileData: FileData = {
      userId: this.userId,
      duration,
      fileType,
      size,
      idempotencyKey: uuidv4(),
    };

    return {
      file,
      fileData,
    };
  }

  async getDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const audioContext = new AudioContext();
        audioContext.decodeAudioData(reader.result as ArrayBuffer).then((buffer) => {
          const duration = buffer.duration;
          resolve(duration);
        });
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
