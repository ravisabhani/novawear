import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { addItem } from '../services/cartService.js';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { _id, name, price, category, image, brand } = product;

  return (
    <Link to={`/products/${_id}`} className="group">
      <motion.article
        whileHover={{ y: -8 }}
        className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-card"
      >
        <div className="relative mb-4 h-64 w-full overflow-hidden rounded-3xl bg-slate-50">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-primary/20 to-primary/30 text-6xl font-black text-primary">
              {name?.charAt(0) || 'N'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-ink">
            {category}
          </span>
          <button
            type="button"
            className="absolute bottom-5 right-5 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-ink transition hover:bg-primary/5"
          >
            Pin
          </button>
        </div>

          <div className="space-y-2 text-ink">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{brand || 'NovaWear'}</p>
          <h3 className="font-display text-2xl text-ink">{name}</h3>
          <div className="flex items-center justify-between text-sm text-muted">
            <p>
              Starting at{' '}
              <span className="text-xl font-semibold text-ink">
                {typeof price === 'number' ? `$${price.toFixed(2)}` : '—'}
              </span>
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await addItem({ productId: _id, quantity: 1 });
                    toast.success('Added to cart');
                  } catch (err) {
                    toast.error('Unable to add to cart');
                  }
                }}
                className="rounded-full bg-primary-dark px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary"
              >
                Add to cart
              </button>

              <span className="text-xs uppercase tracking-[0.4em] text-primary">details</span>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/40 via-primary/20 to-transparent opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
      </motion.article>
    </Link>
  );
};

export default ProductCard;

