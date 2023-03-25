import { StripeAPI } from './stripe';

export interface Env {
  STRIPE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

export interface UserInfo {
  subscription: string;
  period: string;
  part: string;
  supabaseId: string;
  email: string;
}

async function handleRequest(request: Request, env: Env) {
  // if (request.method === 'OPTIONS') return handleOptions(request);

  const userInfo = (await request.json()) as UserInfo;

  const stripe = new StripeAPI({ env, userInfo });
  await stripe.initialise();

  const path = new URL(request.url).pathname;
  const pathArray = path.split('/').filter((item) => item !== '');

  const rootPath = pathArray.shift();
  const workerPath = pathArray.shift();
  const servicePath = pathArray.shift();

  if (rootPath !== 'api') return new Response(`${rootPath} Not Found`, { status: 404 });
  if (workerPath !== 'stripe') return new Response(`${workerPath} Not Found`, { status: 404 });

  switch (servicePath) {
    case 'checkout':
      return await stripe.handleCheckout({
        plan: userInfo.subscription,
        period: userInfo.period,
        part: userInfo.part,
      });

    case 'portal':
      return await stripe.handlePortal();

    case 'upcoming-invoice':
      return await stripe.getUpcomingInvoice();
    default:
      return new Response(`${servicePath} Not Found`, { status: 404 });
  }
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

export default {
  fetch: handleRequest,
};
