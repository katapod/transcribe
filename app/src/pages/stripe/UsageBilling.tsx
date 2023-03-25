import { Button } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';

import { useAuth } from '../../components/authentication/AuthProvider';

async function getCheckoutUrl({
  subscription,
  period,
  part,
  supabaseId,
  email,
}: {
  subscription: string;
  period: 'monthly' | 'yearly';
  part: string;
  supabaseId: string;
  email: string;
}): Promise<string> {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription,
      period,
      part,
      supabaseId,
      email,
    }),
  });

  const body = await res.json();
  return body.url;
}

export default function UsageBilling() {
  const { user } = useAuth();
  const { plan, period, part } = useParams();
  if (!plan || !period || !part) return <Navigate to="/pricing" />;
  return (
    <Button
      variant="contained"
      onClick={async () => {
        const url = await getCheckoutUrl({
          subscription: plan,
          period: period as 'monthly' | 'yearly',
          part,
          supabaseId: user?.id ?? '',
          email: user?.email ?? '',
        });
        window.location.replace(url);
      }}
    >
      Subscribe
    </Button>
  );
}
