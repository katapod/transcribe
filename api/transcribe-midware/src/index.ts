import { FileData } from '../../../app/src/services/transcriber';
import { transcribe } from './transcribe';

/**
 * The bindings assigned to the Worker.
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/kv/#referencing-kv-from-workers}
 * @param NAMESPACE_NAME The KV namespace.
 * @example
 * const url = await env.NAMESPACE_NAME.get('URL');
 */
export interface Env {
  STRIPE_API_KEY: string;
  OPEN_AI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

export interface UserInfo {
  supabaseId: string;
}

export default {
  /**
   * The fetch handler is called whenever a client makes a request to the worker endpoint.
   * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#syntax-module-worker}
   * @param request The incoming HTTP request.
   * @param env The bindings assigned to the Worker.
   * @param ctx The context of the Worker.
   * @returns The response outcome to the request.
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // if (request.method === 'OPTIONS') return handleOptions(request);

    return handleFetch({ request, env, ctx });
  },
};

/**
 * Handle incoming HTTP requests.
 * @param {FetchPayload} payload The payload containing the request, env and ctx.
 * @returns The response outcome to the request.
 */
async function handleFetch({ request, env }: FetchPayload): Promise<Response> {
  const formData = await request.formData();

  const file = formData.get('file');
  const fileData = JSON.parse(formData.get('fileData') as string) as FileData;

  const result = await transcribe({ file, fileData, env });
  return jsonResponse({ text: result });
}

function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
/* 
const corsHeaders = {
  'Access-Control-Allow-Origin': 'localhost',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const handleOptions = (request: Request) => {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: 'GET, POST, PUT, DELETE, HEAD, OPTIONS',
      },
    });
  }
}; */
