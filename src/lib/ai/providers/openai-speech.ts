import type {
  SpeechProviderType,
  TTSRequest,
  TTSResponse,
  AudioInput,
  STTResponse,
  StreamingSpeechRequest,
  StreamingSpeechSession,
} from "@/lib/ai/types";

const OPENAI_TTS_URL = "https://api.openai.com/v1/audio/speech";
const OPENAI_STT_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_REALTIME_URL = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview";

interface OpenAITTSPayload {
  model: "tts-1" | "tts-1-hd";
  input: string;
  voice: string;
  response_format: "mp3" | "wav" | "opus" | "aac" | "flac" | "pcm";
  speed?: number;
}

interface _OpenAISTTPayload {
  model: "whisper-1";
  response_format: "verbose_json";
  language?: string;
}

interface OpenAISTTResponse {
  task: string;
  language: string;
  duration: number;
  text: string;
  segments: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
    confidence?: number;
  }>;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence?: number;
  }>;
}

interface RealtimeEvent {
  type: string;
  event_id?: string;
  response?: {
    id: string;
    status: string;
    status_details?: unknown;
    output?: unknown;
  };
  delta?: string;
  transcript?: string;
  part?: unknown;
  error?: {
    message: string;
    code?: string;
  };
}

const VOICE_MAP: Record<string, string> = {
  alloy: "alloy",
  echo: "echo",
  fable: "fable",
  onyx: "onyx",
  nova: "nova",
  shimmer: "shimmer",
};

function mapFormat(format?: string): OpenAITTSPayload["response_format"] {
  switch (format) {
    case "wav":
      return "wav";
    case "pcm":
      return "pcm";
    default:
      return "mp3";
  }
}

function estimateDuration(text: string, speed: number = 1): number {
  const avgCharsPerSecond = 15;
  return Math.ceil((text.length / avgCharsPerSecond / speed) * 1000);
}

export function createOpenAISpeechProvider(apiKey: string) {
  const name: SpeechProviderType = "openai";

  async function synthesize(req: TTSRequest): Promise<TTSResponse> {
    const payload: OpenAITTSPayload = {
      model: "tts-1",
      input: req.text,
      voice: VOICE_MAP[req.voice] ?? "alloy",
      response_format: mapFormat(req.format),
    };

    if (req.speed !== undefined && req.speed > 0) {
      payload.speed = req.speed;
    }

    const response = await fetch(OPENAI_TTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI TTS API error (${response.status}): ${errorBody}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audio = Buffer.from(arrayBuffer);

    const format = req.format ?? "mp3";
    const durationMs = estimateDuration(req.text, req.speed);

    return { audio, format, durationMs };
  }

  async function transcribe(audio: AudioInput): Promise<STTResponse> {
    const formData = new FormData();

    let blob: Blob;
    if (typeof audio.data === "string") {
      const byteString = atob(audio.data);
      const bytes = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        bytes[i] = byteString.charCodeAt(i);
      }
      blob = new Blob([bytes], { type: `audio/${audio.format}` });
    } else {
      blob = new Blob([audio.data], { type: `audio/${audio.format}` });
    }

    const extension = audio.format === "wav" ? "wav" : audio.format === "ogg" ? "ogg" : audio.format === "pcm" ? "pcm" : "mp3";
    formData.append("file", blob, `audio.${extension}`);
    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");

    if (audio.language) {
      formData.append("language", audio.language);
    }

    const response = await fetch(OPENAI_STT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI STT API error (${response.status}): ${errorBody}`);
    }

    const result: OpenAISTTResponse = await response.json();

    return {
      text: result.text,
      confidence: result.segments?.[0]?.confidence ?? 0,
      language: result.language,
      durationMs: Math.round(result.duration * 1000),
      words:
        result.words?.map((w) => ({
          word: w.word,
          start: w.start,
          end: w.end,
          confidence: w.confidence ?? 0,
        })) ?? [],
    };
  }

  function createStream(params: StreamingSpeechRequest): StreamingSpeechSession {
    let ws: WebSocket | null = null;
    let isClosing = false;

    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      if (isClosing) return;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

      try {
        const WS = WebSocket as unknown as new (...args: any[]) => WebSocket;
        ws = new WS(
          `${OPENAI_REALTIME_URL}`,
          [],
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "OpenAI-Beta": "realtime=v1",
            },
          }
        );
      } catch {
        reconnectTimer = setTimeout(connect, 1000);
        return;
      }

      ws.onopen = () => {
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            voice: VOICE_MAP[params.voice] ?? "alloy",
            input_audio_transcription: {
              model: "whisper-1",
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
          },
        };
        ws?.send(JSON.stringify(sessionUpdate));
      };

      ws.onmessage = (event: MessageEvent) => {
        if (isClosing) return;

        try {
          const data: RealtimeEvent = JSON.parse(event.data as string);

          switch (data.type) {
            case "error":
              params.onError(new Error(data.error?.message ?? "Unknown Realtime error"));
              break;

            case "conversation.item.input_audio_transcription.completed":
              if (data.transcript && data.transcript.trim()) {
                params.onTranscript(data.transcript, true);
              }
              break;

            case "conversation.item.input_audio_transcription.failed":
              params.onError(new Error(data.error?.message ?? "Transcription failed"));
              break;

            case "response.audio.delta":
              if (data.delta) {
                const audioBuffer = Buffer.from(data.delta, "base64");
                params.onAudio(audioBuffer);
              }
              break;

            case "response.audio.done":
              break;

            case "response.done":
              break;

            case "input_audio_buffer.speech_started":
              break;

            case "input_audio_buffer.speech_stopped":
              break;
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onerror = () => {
        // ws errors are followed by onclose
      };

      ws.onclose = () => {
        ws = null;
        if (!isClosing) {
          reconnectTimer = setTimeout(connect, 1000);
        }
      };
    }

    connect();

    return {
      sendAudio(chunk: Buffer) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const base64Audio = chunk.toString("base64");
        const event = {
          type: "input_audio_buffer.append",
          audio: base64Audio,
        };
        ws.send(JSON.stringify(event));
      },

      sendText(text: string) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const itemEvent = {
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text,
              },
            ],
          },
        };
        ws.send(JSON.stringify(itemEvent));
        const responseEvent = {
          type: "response.create",
          response: {
            modalities: ["audio"],
            voice: VOICE_MAP[params.voice] ?? "alloy",
          },
        };
        ws.send(JSON.stringify(responseEvent));
      },

      close() {
        isClosing = true;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        if (ws) {
          ws.onclose = null;
          ws.onerror = null;
          ws.onmessage = null;
          ws.close();
          ws = null;
        }
      },
    };
  }

  function isAvailable(): boolean {
    return !!apiKey;
  }

  return {
    name,
    synthesize,
    transcribe,
    createStream,
    isAvailable,
  };
}
