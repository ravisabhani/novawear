import { createContext, useEffect, useMemo, useState } from 'react';
import { getProfile } from '../services/authService.js';

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  login: () => {},
  logout: () => {},
});

const TOKEN_KEY = 'novawear_token';
const USER_KEY = 'novawear_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  // initializing: true while verifying any stored token on app startup
  const [initializing, setInitializing] = useState(Boolean(token));

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  // If the app starts with a token — verify it by calling /auth/me
  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const profile = await getProfile();
        if (mounted) setUser(profile);
      } catch (err) {
        // token invalid/expired — clear it
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, []); // run once on mount (token read from initial state)

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const handleLogin = (payload) => {
    if (!payload || !payload.token) {
      throw new Error('Invalid authentication payload');
    }

    const { token: authToken, ...rest } = payload;
    setToken(authToken);
    setUser(rest);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      loading,
      setLoading,
      isAuthenticated: Boolean(token),
      login: handleLogin,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

