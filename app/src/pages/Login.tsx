import '../styles/auth.css';

import { CssBaseline, Grid, Paper, Typography } from '@mui/material';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../components/authentication/AuthProvider';

export default function Login() {
  const { userID, supabase } = useAuth();
  if (!supabase) throw new Error("Couldn't find supabase");

  const navigate = useNavigate();
  useEffect(() => {
    if (userID) {
      navigate('/dashboard');
    }
  }, [navigate, userID]);
  return (
    <Fade>
      <Grid container component="main" sx={{ height: '100vh', backgroundColor: '#1a1a1a' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className="auth-container">
            <Typography component="h1" variant="h2">
              Transcribe Ai
            </Typography>

            <Auth
              supabaseClient={supabase.client}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={['google', 'github', 'facebook']}
            />
          </div>
        </Grid>
      </Grid>
    </Fade>
  );
}
