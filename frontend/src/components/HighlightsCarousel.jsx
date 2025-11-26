import { motion } from 'framer-motion';

const highlights = [
  {
    label: 'Biomimicry',
    detail: 'Sea-silk infused threads that flex with body heat.',
  },
  {
    label: 'Zero-waste',
    detail: 'Laser-cut patterns minimise offcuts by 42%.',
  },
  {
    label: 'Aero knit',
    detail: '3D ribbing mapped from athlete motion capture.',
  },
  {
    label: 'Chromashift',
    detail: 'Photoluminescent coatings that react to night light.',
  },
];

const HighlightsCarousel = () => (
  <section className="rounded-[32px] border border-slate-100 bg-white px-6 py-8 text-ink lg:px-10">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-ink/80">Lab Notes</p>
        <h3 className="font-display text-2xl">Material intelligence</h3>
      </div>
      <p className="max-w-md text-sm text-ink/80">
        Each capsule merges parametric tailoring with adaptive fibers to hold structure while remaining fluid.
      </p>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {highlights.map((item, index) => (
        <motion.article
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-ink/80">{item.label}</p>
          <p className="mt-3 text-sm text-ink/80">{item.detail}</p>
        </motion.article>
      ))}
    </div>
  </section>
);

export default HighlightsCarousel;

