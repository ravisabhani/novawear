import React, { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgot as forgotRequest } from '../services/authService.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await forgotRequest({ email });
      setSent(true);
      // announce for screen readers
      const live = document.getElementById('forgot-live');
      if (live) live.textContent = 'If an account exists, a reset link was sent to your email.';
      toast.success(res.message || 'If an account exists, a reset link was sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow ring-1 ring-slate-100">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Reset password</p>
        <h1 className="text-3xl font-semibold text-ink">Forgot your password?</h1>
        <p className="text-slate-500">Enter the email for your account and we'll send instructions on how to reset it.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-500">Email</label>
          <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <Button type="submit" variant="primary" className="w-full text-lg py-3" disabled={submitting || sent}>
          {submitting ? 'Sending…' : sent ? 'Sent — check your email' : 'Send reset instructions'}
        </Button>
        {sent && (
          <p id="forgot-live" aria-live="polite" className="text-center text-sm text-slate-500">If an account exists, you’ll receive an email with next steps shortly. Check your spam folder if you don't see it.</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
