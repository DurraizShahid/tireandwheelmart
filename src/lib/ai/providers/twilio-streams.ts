export interface TwilioMediaStreamEvent {
  event: "connected" | "start" | "media" | "stop" | "mark";
  streamSid?: string;
  sequenceNumber?: string;
  media?: {
    payload: string;
    track: "inbound" | "outbound";
  };
  mark?: {
    name: string;
  };
}

export interface TwilioMediaStreamResponse {
  event: "media" | "mark" | "clear";
  streamSid: string;
  media?: {
    payload: string;
    track: "inbound" | "outbound";
  };
  mark?: {
    name: string;
  };
}

export type TwilioMediaEventCallback = (event: TwilioMediaStreamEvent) => void;

export function createTwilioMediaStreamHandler(
  streamSid: string,
  onMedia?: TwilioMediaEventCallback
) {
  function handleEvent(event: TwilioMediaStreamEvent): void {
    switch (event.event) {
      case "connected":
        break;

      case "start":
        if (event.streamSid) {
          // stream started
        }
        break;

      case "media":
        if (onMedia) {
          onMedia(event);
        }
        break;

      case "stop":
        break;

      case "mark":
        break;

      default:
        break;
    }
  }

  function sendAudio(payload: string): TwilioMediaStreamResponse {
    return {
      event: "media",
      streamSid,
      media: {
        payload,
        track: "inbound",
      },
    };
  }

  function sendMark(name: string): TwilioMediaStreamResponse {
    return {
      event: "mark",
      streamSid,
      mark: {
        name,
      },
    };
  }

  function close(): void {
    // no-op; caller should close the underlying WebSocket
  }

  return {
    handleEvent,
    sendAudio,
    sendMark,
    close,
  };
}
