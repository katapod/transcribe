import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Env, UserInfo } from '.';
import { FileData } from '../../../app/src/services/transcriber';

interface User {
  supabaseId: string;
  stripeId: string;
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
    };
  }

  async getStripeId(supabaseId: string) {
    const { data: stripeRow } = await this.supabase
      .from('stripe')
      .select('*')
      .eq('id', supabaseId)
      .limit(1)
      .maybeSingle();
    if (!stripeRow) throw new Error('No Stripe Row in Supabase');
    return stripeRow.stripe_id;
  }

  async getMeteredSubscriptionItemId() {
    if (!this.user) throw new Error('No User');
    const { data: subscriptions } = await this.stripe.subscriptions.list({
      customer: this.user.stripeId,
    });

    const filteredSubs = subscriptions.map((sub) => {
      return sub.items.data.find((item) => item?.price?.recurring?.usage_type === 'metered');
    });

    if (filteredSubs.length === 0) throw new Error('No metered subscription items found');

    const itemIds = filteredSubs.map((item) => item?.id);

    const id = itemIds[0];

    if (!id) throw new Error('No metered subscription item found');

    return id;
  }

  async recordUsage({ quantity, idempotencyKey }: { quantity: number; idempotencyKey: string }) {
    const subscriptionItemId = await this.getMeteredSubscriptionItemId();
    await this.stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      { quantity },
      // eslint-disable-next-line prettier/prettier
      { idempotencyKey }
    );
  }

  async storeTranscription({
    fileData,
    transcription,
  }: {
    fileData: FileData;
    transcription: string;
  }) {
    const row = {
      supabase_id: this.user?.supabaseId,
      stripe_id: this.user?.stripeId,
      transcription,
      file_size: fileData.size,
      file_duration: fileData.duration,
      file_type: fileData.fileType,
      idempotency_key: fileData.idempotencyKey,
    };
    await this.supabase.from('transcriptions').insert(row);
    await this.supabase.from('transcriptions-log').insert(row);
  }
}
