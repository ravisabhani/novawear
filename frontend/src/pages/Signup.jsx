import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button.jsx';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth.js';
import { register as registerRequest } from '../services/authService.js';

const Signup = () => {
  const navigate = useNavigate();
  const { login, setLoading, isAuthenticated, initializing } = useAuth();

  // Redirect away from signup once token verification completes
  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, initializing, navigate]);

  const [form, setForm] = useState({ name: '', email: '', password: '', adminSecret: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSubmitting(true);

    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      if (isAdmin && form.adminSecret) payload.adminSecret = form.adminSecret;

      const data = await registerRequest(payload);

      // Automatically log the user in after registration
      login(data);
      toast.success('Welcome — registration successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow ring-1 ring-slate-100">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Create account</p>
        <h1 className="text-3xl font-semibold text-ink">Sign up for NovaWear</h1>
        <p className="text-slate-500">Create an account to manage orders, favorites and get full access.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-slate-500">Full name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Jane Doe" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-500">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-slate-500">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="flex items-center gap-3">
          <input id="isAdmin" type="checkbox" checked={isAdmin} onChange={() => setIsAdmin((s) => !s)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
          <label htmlFor="isAdmin" className="text-sm text-slate-600">Register as admin (requires secret)</label>
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <label htmlFor="adminSecret" className="text-sm font-semibold text-slate-500">Admin secret</label>
            <input id="adminSecret" name="adminSecret" type="password" value={form.adminSecret} onChange={handleChange} placeholder="Admin secret (provided by server admins)" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <p className="text-xs text-slate-400">Only use this on a secure, server-managed environment — this value must match the server's ADMIN_SECRET.</p>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full text-lg py-3" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p>
    </div>
  );
};

export default Signup;
