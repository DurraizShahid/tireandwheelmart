import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  return new NextResponse(
    "WebSocket endpoint. Use wss:// protocol to connect.\n\n" +
    "Next.js 15 App Router does not natively support WebSocket upgrade in route handlers.\n" +
    "To enable WebSocket support:\n" +
    "  1. Configure a custom server (server.ts) with WebSocket server\n" +
    "  2. Add next.config.js: experimental: { webSocket: true }\n" +
    "  3. Import and use handleMediaStreamConnection from this module\n\n" +
    "See: src/lib/ai/providers/twilio-streams.ts and openai-realtime.ts for the bridge implementation.",
    {
      status: 426,
      headers: { "Content-Type": "text/plain" },
    },
  );
}

export async function POST(_req: NextRequest) {
  return new NextResponse(
    "This endpoint requires a WebSocket connection (wss://). Use GET to upgrade.",
    { status: 426, headers: { "Content-Type": "text/plain" } },
  );
}
