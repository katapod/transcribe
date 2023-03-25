import './styles/index.css';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import log from 'loglevel';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

import { UserData } from './components/authentication/AuthProvider';
import { ProtectedRoute } from './components/authentication/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import Dashboard, { TranscriptionHistory } from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Root from './pages/Root';
import Pricing from './pages/stripe/Pricing';
import UsageBilling from './pages/stripe/UsageBilling';
import Transcribe from './pages/Transcribe';
import TranscribeHistory from './pages/TranscribeHistory';
import User from './pages/User';
import { AuthLayout } from './pages/utility/AuthLayout';
import ErrorPage from './pages/utility/ErrorPage';

const isDev = import.meta.env.DEV;

log.setLevel(isDev ? 'debug' : 'warn');
log.info(`Starting in ${isDev ? 'development' : 'production'} mode`);

if (!isDev) {
  Sentry.init({
    dsn: 'https://d120e9cb08f04f4387be135ebd2655d4@o4504824624906240.ingest.sentry.io/4504824626544640',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const getUserData = async () => {
  const userString = window.localStorage.getItem('user');

  const user = userString ? (JSON.parse(userString) as UserData) : null;

  if (!user) {
    return Promise.resolve(null);
  }
  return Promise.resolve(user);
};

const getUserTranscriptions = async () => {
  const transcriptionString = window.localStorage.getItem('transcriptions');

  const transcriptions = transcriptionString
    ? (JSON.parse(transcriptionString) as Array<TranscriptionHistory>)
    : null;

  if (!transcriptions) {
    return Promise.resolve(null);
  }
  return Promise.resolve(transcriptions);
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    loader: () => getUserData().then((user) => ({ userPromise: Promise.resolve(user) })),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: 'loading',
        element: <LoadingScreen />,
      },
      {
        path: '',
        element: <Root />,
        children: [
          {
            path: '',
            element: <Home />,
          },
          {
            path: 'demo',
            element: (
              <Navigate
                to="/"
                state={{
                  scroll: 'demo',
                }}
              />
            ),
          },
          {
            path: 'how',
            element: (
              <Navigate
                to="/"
                state={{
                  scroll: 'how',
                }}
              />
            ),
          },
          {
            path: 'pricing',
            element: <Pricing />,
          },
          {
            path: 'features',
            element: (
              <Navigate
                to="/"
                state={{
                  scroll: 'features',
                }}
              />
            ),
          },
          {
            path: 'contact',
            element: (
              <Navigate
                to="/"
                state={{
                  scroll: 'contact',
                }}
              />
            ),
          },
          {
            path: '',
            element: (
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                path: '',
                element: <Home />,
              },
              {
                path: 'account',
                element: <User />,
              },
              {
                path: 'dashboard',
                element: <Dashboard />,
                loader: () =>
                  getUserTranscriptions().then((transcriptions) => ({
                    transcriptionsPromise: Promise.resolve(transcriptions),
                  })),
              },
              {
                path: 'transcribehistory',
                element: <TranscribeHistory />,
              },
              {
                path: 'transcribe',
                element: <Transcribe />,
              },
              {
                path: 'usagebilling/:plan/:period/:part',
                element: <UsageBilling />,
              },
              {
                path: 'success',
                element: <Navigate to="/pricing" />,
              },
              {
                path: 'canceled',
                element: <Navigate to="/pricing" />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
