import { useState, useEffect } from 'react';
import Button from '../components/ui/Button.jsx';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth.js';
import { login as loginRequest } from '../services/authService.js';

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [form, setForm] = useState({ email: '', password: '' });
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
      const data = await loginRequest(form);
      login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow ring-1 ring-slate-100">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Welcome back</p>
        <h1 className="text-3xl font-semibold text-ink">Sign in to NovaWear</h1>
        <p className="text-slate-500">Access your dashboard to manage orders, favorites, and drops.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-500">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@email.com"
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <div />
          <Link to="/forgot" className="font-medium text-primary hover:underline">Forgot password?</Link>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-slate-500">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full text-lg py-3" disabled={submitting}>
          {submitting ? 'Signing you in…' : 'Login'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/" className="font-semibold text-primary">
          Explore collections
        </Link>
      </p>
    </div>
  );
};

export default Login;

