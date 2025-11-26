import React from 'react';
import { render } from '@testing-library/react';
import { AuthContext } from '../src/context/AuthContext.jsx';
import { MemoryRouter } from 'react-router-dom';

export function renderWithAuth(ui, { user = null, token = null, initialEntries = ['/'], ...options } = {}) {
  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading: false,
    login: () => {},
    logout: () => {},
    setLoading: () => {},
  };

  return render(<AuthContext.Provider value={value}><MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter></AuthContext.Provider>, options);
}
