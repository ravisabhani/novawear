import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { createProduct } from '../services/productService.js';

const initialState = {
  name: '',
  description: '',
  price: '',
  category: '',
  brand: '',
  image: '',
  stockQuantity: 0,
  inStock: true,
};

const AdminAddProduct = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-slate-600 shadow">
        <p className="text-lg font-semibold text-ink">Admin access only</p>
        <p className="mt-2 text-sm text-slate-500">You need admin privileges to add products.</p>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      };
      await createProduct(payload);
      setForm(initialState);
      toast.success('Product published successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 rounded-[32px] bg-white/90 p-8 shadow ring-1 ring-slate-100">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Admin</p>
        <h1 className="text-3xl font-semibold text-ink">Add new product</h1>
        <p className="text-slate-500">Upload new arrivals with categories, pricing, and stock details.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-slate-500">
            Product name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="brand" className="text-sm font-semibold text-slate-500">
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-semibold text-slate-500">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-semibold text-slate-500">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-semibold text-slate-500">
            Category
          </label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="stockQuantity" className="text-sm font-semibold text-slate-500">
            Stock quantity
          </label>
          <input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-semibold text-slate-500">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500">
          <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
          In stock
        </label>

        <div className="md:col-span-2">
          <Button type="submit" variant="primary" className="w-full py-4 text-lg" disabled={submitting}>
            {submitting ? 'Publishing…' : 'Publish product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;

