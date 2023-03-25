import { User } from '@supabase/supabase-js';
import log from 'loglevel';
import React, { createContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SupabaseAPI } from '../../services/supabase';
import ThemeModeProvider from '../theme/ThemeModeProvider';

type ContextProps = {
  userID: null | string;
  user: null | UserData;
  supabase: SupabaseAPI;
  onLogin: (userID: string, user: User) => void;
  onLogout: () => void;
};

interface SupabaseUserData {
  id: string;
  email: string;
  preferred_name: string;
  first_name: string;
  last_name: string;
  initials: string;
  avatar_url: string;
}

interface AdditionalUserData {
  stripe_id: string;
}

export type UserData = SupabaseUserData & AdditionalUserData;

const AuthContext = createContext<Partial<ContextProps>>({});
const supabase = new SupabaseAPI();

export const AuthProvider = ({
  userData,
  children,
}: {
  userData: UserData | null;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userID, setUserID] = React.useState<string | null>(userData?.id ?? null);
  const [user, setUser] = React.useState<UserData | null>(userData ?? null);
  log.debug('Auth Provider initialized userId', userID);
  log.debug('Auth Provider initialized user', user);

  const handleLogin = async (userID: string, user: User) => {
    log.debug('handleLogin called', userID);
    setUserID(userID);
    window.localStorage.setItem('userID', userID);

    const fullName = user.email ? user.email.split('@')[0].split('.') : ['NA', 'NA'];

    const { data, error } = await supabase.client
      .from('stripe')
      .select('*')
      .eq('id', userID)
      .limit(1)
      .maybeSingle();

    if (error) {
      log.warn('error', error);
    }

    const userData: Partial<UserData> = {
      id: user.id,
      email: user.email ?? 'NA',
      first_name: fullName[0],
      last_name: fullName[1],
      preferred_name: user.user_metadata?.preferred_name ?? fullName[0] ?? 'NA',
      avatar_url: user.user_metadata?.avatar_url ?? 'NA',
      stripe_id: data?.stripe_id,
    };

    userData.initials =
      userData.first_name && userData.last_name
        ? `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase()
        : 'NA';

    setUser(userData as UserData);
    window.localStorage.setItem('user', JSON.stringify(userData));

    const origin = location.state?.from?.pathname;
    log.debug('origin', origin);
    if (origin) {
      if (origin === '/login') {
        log.debug('redirecting to /');
        navigate('/');
      } else {
        log.debug('redirecting to ', origin);
        navigate(origin);
      }
    } else {
      log.debug('location.pathname', location.pathname);
      if (location.pathname === '/login') {
        navigate('/');
        log.debug('redirecting to /');
      }
    }
  };

  const handleLogout = () => {
    supabase.client.auth.signOut();
    setUserID(null);
    setUser(null);
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('userID');
    navigate('/login');
  };

  useEffect(() => {
    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.client.auth.onAuthStateChange(async (event, session) => {
      log.debug('event', event);
      log.debug('session', session);
      const email = session?.user.email;
      const userID = session?.user.id;
      log.debug('session use id', userID);
      switch (event) {
        case 'SIGNED_IN':
          log.debug('Signed in successfully');
          if (!userID) throw new Error('No user ID');
          handleLogin(userID, session.user);
          break;
        case 'SIGNED_OUT':
          log.debug('Signed out');
          break;
        case 'TOKEN_REFRESHED':
          log.debug('Token refreshed');
          break;
        case 'USER_UPDATED':
          log.debug(`User ${email} updated`);
          break;
        case 'PASSWORD_RECOVERY':
          log.debug(`Recovery email sent to ${email}`);
          break;
        case 'USER_DELETED':
          log.debug(`User ${email} deleted`);
          break;
        default:
          console.warn('Unknown event', event, session);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userID,
        user,
        supabase,
        onLogin: handleLogin,
        onLogout: handleLogout,
      }}
    >
      <ThemeModeProvider>{children}</ThemeModeProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
