import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth } from '../components/authentication/AuthProvider';
import LoadingScreen from '../components/LoadingScreen';
import { UserInfo } from '../components/user/UserInfo';

async function getPortalUrl({
  supabaseId,
  email,
}: {
  supabaseId: string;
  email: string;
}): Promise<string> {
  const res = await fetch('/api/stripe/portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supabaseId,
      email,
    }),
  });

  const body = await res.json();
  return body.url;
}

export default function User() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  return (
    <Container>
      {loading && <LoadingScreen message={loadingMessage} />}
      {user ? (
        <Box>
          <UserInfo user={user} />
          <Typography variant="h4">Billing</Typography>
          <Button
            variant="contained"
            onClick={async () => {
              setLoadingMessage('Redirecting to Stripe...');
              setLoading(true);
              const url = await getPortalUrl({
                supabaseId: user?.id ?? '',
                email: user?.email ?? '',
              });
              window.location.replace(url);
            }}
          >
            Stripe Portal
          </Button>
        </Box>
      ) : (
        <h1>Not logged in</h1>
      )}
      <Outlet />
    </Container>
  );
}
