import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Env, UserInfo } from '.';

interface User {
  supabaseId: string;
  stripeId: string;
  email: string;
}

export interface CheckoutPayload {
  plan: string;
  period: string;
  part: string;
}

export class StripeAPI {
  private stripe: Stripe;
  private supabase: SupabaseClient;
  private user?: User;
  private userInfo: UserInfo;
  private customer?: Stripe.Customer;
  constructor({ env, userInfo }: { env: Env; userInfo: UserInfo }) {
    this.stripe = new Stripe(env.STRIPE_API_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2022-11-15',
    });
    this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    this.userInfo = userInfo;
  }

  async initialise(): Promise<void> {
    this.user = await this.getUser(this.userInfo);
  }

  async getUser(userInfo: UserInfo): Promise<User> {
    const stripeId = await this.getStripeId(userInfo.supabaseId);
    return {
      supabaseId: userInfo.supabaseId,
      stripeId,
      email: userInfo.email,
    };
  }

  async getStripeId(supabaseId: string) {
    const { data: stripeRow, error } = await this.supabase
      .from('stripe')
      .select('*')
      .eq('id', supabaseId)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!stripeRow) {
      await this.createCustomer();
      if (!this.customer) throw new Error('No Customer');
      return this.customer.id;
    }
    return stripeRow.stripe_id;
  }

  async createCustomer(): Promise<void> {
    if (!this.userInfo) throw new Error('No User Info');
    this.customer = await this.stripe.customers.create({
      email: this.userInfo.email,
      metadata: {
        supabaseId: this.userInfo.supabaseId,
      },
    });
  }

  getPriceIds(subscription: string): {
    base_monthly: string;
    base_yearly?: string;
    usage: string;
  } {
    switch (subscription.toLowerCase()) {
      case 'basic':
        return {
          base_monthly: 'price_1MkLnmGshsrPnzgFf9DQehQT',
          usage: 'price_1MkLnlGshsrPnzgFQgLaPbYV',
        };
      case 'pro':
        return {
          base_monthly: 'price_1MkLpdGshsrPnzgFBgAePfkN',
          base_yearly: 'price_1MkLq2GshsrPnzgFGkIshuxt',
          usage: 'price_1MlsfGGshsrPnzgFCZvixwCl',
        };
      case 'business':
        return {
          base_monthly: 'price_1MkLraGshsrPnzgFPVWRuQfs',
          base_yearly: 'price_1MkLraGshsrPnzgFNrNw2iLg',
          usage: 'price_1MlskbGshsrPnzgFXSTzeg1V',
        };
      default:
        throw new Error('Invalid subscription');
    }
  }

  async handleCheckout({ plan, period, part }: CheckoutPayload) {
    if (!this.user) throw new Error('No User');
    const priceIds = this.getPriceIds(plan);
    const line_items: Array<Stripe.Checkout.SessionCreateParams.LineItem> = [];

    if (part !== 'usage') {
      line_items.push({
        price: period === 'yearly' ? priceIds.base_yearly : priceIds.base_monthly,
        quantity: 1,
      });
    }

    if (period !== 'yearly') {
      line_items.push({
        price: priceIds.usage,
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: this.user.stripeId,
      line_items,
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url:
        period === 'yearly'
          ? `https://transcribeai.app/usagebilling/${plan}/monthly/usage`
          : 'https://transcribeai.app/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://transcribeai.app/canceled',
    });

    return Response.json({ url: session.url, stripeId: this.user.stripeId });
  }

  async handlePortal() {
    if (!this.user) throw new Error('No User');
    const portal = await this.stripe.billingPortal.sessions.create({
      customer: this.user.stripeId,
      return_url: 'https://transcribeai.app',
    });
    return Response.json({ url: portal.url });
  }
  async getUpcomingInvoice() {
    if (!this.user) throw new Error('No User');
    const invoices = await this.stripe.invoices.retrieveUpcoming({
      customer: this.user.stripeId,
    });
    return Response.json(invoices);
  }
}
