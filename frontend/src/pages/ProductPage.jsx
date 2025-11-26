import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Button from '../components/ui/Button.jsx';
import { getProductById, getProducts } from '../services/productService.js';
import { addItem } from '../services/cartService.js';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getProductById(id);
        setProduct(data);

        const relatedProducts = await getProducts({
          category: data.category,
          limit: 3,
        });
        setRelated((relatedProducts || []).filter((item) => item._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="grid gap-10 rounded-[32px] bg-white/90 p-8 shadow ring-1 ring-slate-100 lg:grid-cols-2">
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
        <div className="space-y-6">
          <div className="h-6 w-1/3 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-12 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/2 rounded-full bg-slate-200 animate-pulse" />
          </div>
          <div className="h-12 w-1/2 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-16 rounded-3xl bg-slate-100 animate-pulse" />
          <div className="h-12 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-slate-600 shadow">
        <p className="mb-4 text-lg font-semibold text-ink">{error || 'Product not found'}</p>
        <Link to="/" className="text-primary underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <section className="grid gap-10 rounded-[32px] bg-white/90 p-8 shadow ring-1 ring-slate-100 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-100 p-4">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-white to-primary/10 text-7xl font-black text-primary/50">
              {product.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold text-ink">{product.name}</h1>
          <p className="text-slate-600">{product.description}</p>

          <div className="flex items-center gap-6">
            <p className="text-4xl font-bold text-ink">
              {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : '—'}
            </p>
            <span className="text-sm text-slate-500">{product.brand || 'NovaWear'}</span>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-500">Shipping & Availability</p>
            <p className="text-slate-600">
              {product.inStock ? 'In stock – ships in 1-2 days' : 'Currently out of stock'}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            className="w-full py-4 text-lg"
            onClick={async () => {
              try {
                await addItem({ productId: id, quantity: 1 });
                toast.success('Added to cart');
              } catch (err) {
                toast.error('Unable to add to cart');
              }
            }}
          >
            Add to cart
          </Button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-ink">You might also like</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;

