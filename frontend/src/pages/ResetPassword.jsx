import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { reset as resetRequest, getProfile } from '../services/authService.js';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { login, setLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoading(true);

    try {
      // call reset endpoint, which returns token
      const res = await resetRequest(token, { password });

      // If it returns auth token only, fetch profile then login
      const tokenOnly = res?.data?.token || res?.token || res;

      // The backend returns { data: { token }} so call getProfile after setting token in localStorage
      // We'll stash token temporarily then fetch profile
      if (tokenOnly) {
        // login flow - we need to combine token + profile
        // temporary set into localStorage so api attaches header for getProfile
        localStorage.setItem('novawear_token', tokenOnly);
        const profile = await getProfile();
        login({ token: tokenOnly, ...profile });
        toast.success('Password reset successful — you are now signed in');
        setDone(true);
        const live = document.getElementById('reset-live');
        if (live) live.textContent = 'Password reset successful. You are now signed in.';
        // brief delay to give user feedback before redirecting
        setTimeout(() => navigate('/'), 900);
      } else {
        toast.success(res.message || 'Password reset successful');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to reset password');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow ring-1 ring-slate-100">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Finish reset</p>
        <h1 className="text-3xl font-semibold text-ink">Set a new password</h1>
        <p className="text-slate-500">Choose a secure password to finish resetting your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-slate-500">New password</label>
          <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <Button type="submit" variant="primary" className="w-full py-3 text-lg" disabled={submitting || done}>
          {submitting ? 'Resetting…' : done ? 'All set — redirecting…' : 'Reset password'}
        </Button>
        {done && <div id="reset-live" aria-live="polite" className="text-center text-sm text-slate-500 mt-2">Password reset complete — redirecting you.</div>}
      </form>
    </div>
  );
};

export default ResetPassword;
