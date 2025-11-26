import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { useEffect, useState } from 'react';
import { getCart } from '../services/cartService.js';
import Button from './ui/Button.jsx';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/#catalog', isHash: true },
  { label: 'Admin', to: '/admin/add-product', adminOnly: true },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      if (!user) {
        setCount(0);
        return;
      }
      try {
        const data = await getCart();
        if (mounted) setCount((data?.items || []).reduce((s, it) => s + it.quantity, 0));
      } catch (err) {
        // ignore
      }
    };

    refresh();

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/80 shadow backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-ink">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">NW</span>
          NovaWear
        </Link>

        <button
          type="button"
          onClick={handleToggle}
          className="rounded-lg p-2 text-ink hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <nav
          id="primary-navigation"
          className={`absolute left-0 top-full w-full bg-white px-4 pb-6 pt-4 shadow md:static md:flex md:w-auto md:items-center md:gap-8 md:bg-transparent md:p-0 md:shadow-none ${
            open ? 'block' : 'hidden md:flex'
          }`}
        >
          {navLinks.map((link) => {
            if (link.adminOnly && user?.role !== 'admin') return null;

            if (link.isHash) {
              return (
                <a
                  key={link.label}
                  href={link.to}
                  className="block rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-primary md:px-0 md:py-0"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-0 md:py-0 ${
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-ink'
                  }`
                }
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            );
          })}
          <div className="mt-4 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center">
            {isAuthenticated ? (
              <>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {user?.name || 'User'}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full px-5 py-2 text-sm font-semibold"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/signup" onClick={closeMenu} className="rounded-full border border-slate-200 px-5 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  Sign up
                </Link>

                <Link to="/login" onClick={closeMenu} className="rounded-full bg-primary px-6 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:bg-primary-dark">
                  Login
                </Link>
                <Link to="/cart" onClick={closeMenu} className="relative inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  Cart
                  {count > 0 && <span className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">{count}</span>}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

