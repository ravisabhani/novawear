import { motion } from 'framer-motion';

const slides = [
  {
    title: 'MonoLayer',
    subtitle: 'Adaptive knit bodysuit',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1100&q=80',
  },
  {
    title: 'Glint Shell',
    subtitle: 'Reflective watercoat',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1100&q=80',
  },
  {
    title: 'Halo Knit',
    subtitle: 'Weightless merino mesh',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=80',
  },
];

const LookbookStrip = () => (
  <section id="lookbook" className="space-y-6 rounded-[40px] bg-white p-6 text-ink ring-1 ring-slate-100 lg:p-10">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-ink/80">Lookbook 02</p>
        <h2 className="font-display text-3xl">Editorial moments</h2>
      </div>
      <p className="max-w-lg text-sm text-ink/80">
        Shot on 35mm film in Lisbon’s old quarter. Each silhouette morphs through tracked sunlight to reveal luminous
        cores and diffused shadows.
      </p>
    </div>

    <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto pb-4">
      {slides.map((slide) => (
        <motion.article
          key={slide.title}
          whileHover={{ y: -8 }}
          className="relative h-72 min-w-[280px] flex-1 snap-start overflow-hidden rounded-3xl bg-slate-50"
        >
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/80">{slide.subtitle}</p>
            <p className="font-display text-2xl text-ink">{slide.title}</p>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

export default LookbookStrip;

