import { Avatar, Box, Button, SvgIcon, Typography } from '@mui/material';
import log from 'loglevel';
import { Link } from 'react-router-dom';

import type { Subscription } from '../../../data/stripe';
import { useAuth } from '../authentication/AuthProvider';

export default function PricingPlanRow({
  plans,
  period,
  rateInterval,
  guest,
}: {
  plans: Array<Subscription>;
  period: 'monthly' | 'yearly';
  rateInterval: 'minute' | 'second' | 'hour';
  guest: boolean;
}) {
  const { user, supabase } = useAuth();

  async function getCheckoutUrl({
    subscription,
    period,
    supabaseId,
    email,
  }: {
    subscription: string;
    period: 'monthly' | 'yearly';
    supabaseId: string;
    email: string;
  }): Promise<string> {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        period,
        supabaseId,
        email,
      }),
    });

    const body = await res.json();
    const stripeId = body.stripeId;

    log.debug('stripeId', stripeId);
    if (!user?.stripe_id && stripeId && supabase) {
      await supabase.client.from('stripe').insert({ id: user?.id, stripe_id: stripeId }).single();
    }

    return body.url;
  }
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(120px, 1fr) repeat(3, minmax(160px, 1fr))',
          md: 'minmax(160px, 1fr) repeat(3, minmax(230px, 1fr))',
        },
      }}
    >
      <Typography>Plans</Typography>
      {plans.map((plan) => (
        <Box
          key={plan.name}
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            borderRadius: '10px 10px 0 0',
            borderWidth: '1px 1px 0 1px',
            borderStyle: 'solid',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          }}
        >
          <Box display={'flex'} flexDirection={'row'}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  margin: 0,
                  fontFamily: `"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: 0,
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {plan.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  margin: 0,
                  fontFamily: `"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: 0,
                  marginTop: '5px',
                }}
              >
                {plan.description}
              </Typography>
            </Box>
            <Box>
              <Avatar
                sx={{
                  backgroundColor: plan.icon.color ?? 'error.main',
                  height: 54,
                  width: 54,
                }}
              >
                <SvgIcon>
                  <plan.icon.component />
                </SvgIcon>
              </Avatar>
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '20px',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  margin: 0,
                  fontFamily: `"PlusJakartaSans-Bold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontSze: '1.75rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: '0.2px',
                  fontWeight: 700,
                }}
              >
                {plan.price.monthly === 0
                  ? 'Free'
                  : `$${
                      period === 'yearly' ? Math.floor(plan.price.yearly / 12) : plan.price.monthly
                    }`}
              </Typography>
              <Box width="5px" />
              <Typography
                variant="body2"
                paragraph={true}
                sx={{
                  margin: 0,
                  fontFamily: `"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: 0,
                  marginTop: '3px',
                }}
              >
                {plan.price.monthly === 0 ? '' : `/month`}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '20px',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  margin: 0,
                  fontFamily: `"PlusJakartaSans-Bold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontSze: '1.75rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: '0.2px',
                  fontWeight: 700,
                }}
              >
                {plan.freeMinutes ? `${plan.freeMinutes} free minutes` : '\u00A0'}
              </Typography>
              <Box width="5px" />
              <Typography
                variant="body2"
                paragraph={true}
                sx={{
                  margin: 0,
                  fontFamily: `"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: 0,
                  marginTop: '3px',
                }}
              >
                {plan.freeMinutes ? `/month` : '\u00A0'}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '20px',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  margin: 0,
                  fontFamily: `"PlusJakartaSans-Bold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontSze: '1.75rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: '0.2px',
                  fontWeight: 700,
                }}
              >
                $
                {rateInterval === 'minute'
                  ? plan.price.perMinute
                  : rateInterval === 'second'
                  ? (plan.price.perMinute / 60).toFixed(6)
                  : plan.price.perMinute * 60}
              </Typography>
              <Box width="5px" />
              <Typography
                variant="body2"
                paragraph={true}
                sx={{
                  margin: 0,
                  fontFamily: `"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
                  letterSpacing: 0,
                  marginTop: '3px',
                }}
              >
                /{rateInterval}
              </Typography>
            </Box>
          </Box>
          {guest ? (
            <Button component={Link} to="/login" variant="contained" size="large">
              Sign Up
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={async () => {
                const url = await getCheckoutUrl({
                  subscription: plan.name,
                  period: plan.name === 'Basic' ? 'monthly' : period,
                  supabaseId: user?.id ?? '',
                  email: user?.email ?? '',
                });
                window.location.replace(url);
              }}
            >
              Change Plan
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
}
