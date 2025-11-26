import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAuth } from './test-utils.jsx';
import ForgotPassword from '../src/pages/ForgotPassword.jsx';
import ResetPassword from '../src/pages/ResetPassword.jsx';
import { Routes, Route } from 'react-router-dom';
import * as authService from '../src/services/authService.js';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast');

describe('Forgot/Reset pages', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('Forgot page calls authService.forgot and shows toast', async () => {
    const spy = vi.spyOn(authService, 'forgot').mockResolvedValue({ message: 'If exists, email sent' });
    const toastSpy = vi.spyOn(toast, 'success');

    renderWithAuth(<ForgotPassword />,{ initialEntries: ['/forgot'] });

    const email = screen.getByLabelText(/email/i);
    await userEvent.type(email, 'test@example.com');

    const btn = screen.getByRole('button', { name: /send reset instructions/i });
    await userEvent.click(btn);

    await waitFor(() => expect(spy).toHaveBeenCalledWith({ email: 'test@example.com' }));
    expect(toastSpy).toHaveBeenCalled();
  });

  test('Reset page calls reset and sets token in localStorage + fetches profile', async () => {
    const token = 'abc123';
    const spyReset = vi.spyOn(authService, 'reset').mockResolvedValue({ data: { token } });
    const spyProfile = vi.spyOn(authService, 'getProfile').mockResolvedValue({ _id: 'u1', name: 'User', email: 'u@e.com', role: 'user' });
    const toastSpy = vi.spyOn(toast, 'success');

    renderWithAuth(
      <Routes>
        <Route path="/reset/:token" element={<ResetPassword />} />
      </Routes>,
      { initialEntries: [`/reset/${token}`] }
    );

    const pw = screen.getByLabelText(/new password/i);
    await userEvent.type(pw, 'newPassword');

    const btn = screen.getByRole('button', { name: /reset password/i });
    await userEvent.click(btn);

    await waitFor(() => expect(spyReset).toHaveBeenCalledWith(token, { password: 'newPassword' }));
    await waitFor(() => expect(spyProfile).toHaveBeenCalled());
    expect(localStorage.getItem('novawear_token')).toBe(token);
    expect(toastSpy).toHaveBeenCalled();
  });
});
