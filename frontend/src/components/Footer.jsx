import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-20 border-t border-slate-100 bg-white py-10 text-ink">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-semibold">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">NW</span>
            NovaWear
          </Link>
          <p className="mt-3 max-w-md text-sm text-ink/70">Handmade modern essentials. Built for comfort and crafted for longevity.</p>
        </div>

        <div className="flex gap-8">
          <div>
            <h4 className="text-sm font-semibold text-ink/80">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink/80">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li><Link to="/help" className="hover:text-primary">Help center</Link></li>
              <li><Link to="/shipping" className="hover:text-primary">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-primary">Returns</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-ink/60">© {new Date().getFullYear()} NovaWear. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer;
