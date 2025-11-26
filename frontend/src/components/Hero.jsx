import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const floatingBadges = [
  { label: 'Drop 07', detail: '120 pcs', position: 'top-10 left-6' },
  { label: 'Lab Crafted', detail: 'biodegradable dyes', position: 'bottom-14 right-6' },
];

const Hero = () => {
  return (
    <section className="relative grid gap-12 rounded-[40px] bg-gradient-to-br from-white/80 via-primary/5 to-white/90 px-8 py-16 shadow-glass ring-1 ring-slate-100 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-20">
      <div className="space-y-8 text-ink">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          NovaWear Studio · Crafted with Heritage
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl"
        >
          Discover festival-ready silhouettes inspired by Indian craft and modern polish.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="max-w-xl text-lg text-ink/70"
        >
          Celebrate color and tradition—handwoven textures, bright palettes and modern tailoring for every festive
          occasion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="flex flex-wrap gap-4"
        >
          <Link to="#catalog">
              <button className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary-dark">
              Explore New Festive Drops
            </button>
          </Link>
          <a href="#lookbook">
            <button className="rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:bg-primary/5">
              View lookbook
            </button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-wrap gap-6 text-sm text-ink/70"
        >
          <div>
            <p className="text-2xl font-semibold text-primary">128</p>
            <p className="text-ink/70">custom textiles sampled</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-primary">72h</p>
            <p className="text-ink/70">from concept to drop</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-primary">05</p>
            <p className="text-ink/70">biophilic palettes</p>
          </div>
        </motion.div>
      </div>

      <div className="relative flex items-center justify-center">
          <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative h-[420px] w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-slate-50 via-primary/5 to-white p-4 ring-1 ring-slate-100 lg:h-[500px]"
        >
          <div className="absolute inset-4 rounded-[28px] bg-[url('https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center shadow-card" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[32px]" />

          {floatingBadges.map((badge) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`absolute ${badge.position} rounded-2xl border border-slate-200 bg-white px-4 py-3 text-ink shadow-sm`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-ink/60">{badge.label}</p>
              <p className="text-sm font-semibold">{badge.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

