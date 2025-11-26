import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthContext.jsx';
import Login from '../src/pages/Login.jsx';

const renderWithAuth = (value, initialEntries = ['/login']) =>
  render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<div>HOME</div>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

test('does not redirect when initializing is true (verification in progress)', async () => {
  renderWithAuth({ isAuthenticated: true, initializing: true, login: vi.fn(), setLoading: vi.fn() });

  // Login form should be visible because redirect waits for initializing=false
  expect(await screen.findByRole('heading', { name: /sign in to novawear/i })).toBeInTheDocument();
});

test('redirects to / when authenticated and initializing is false', async () => {
  renderWithAuth({ isAuthenticated: true, initializing: false, login: vi.fn(), setLoading: vi.fn() }, ['/login']);

  await waitFor(() => {
    expect(screen.queryByText('HOME')).toBeInTheDocument();
  });
});
