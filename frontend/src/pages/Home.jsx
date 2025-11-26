import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LookbookStrip from '../components/LookbookStrip.jsx';
import HighlightsCarousel from '../components/HighlightsCarousel.jsx';
import { getCategories, getProducts } from '../services/productService.js';

const defaultFilters = {
  search: '',
  category: '',
  sort: 'newest',
};

const parseFilters = (params) => ({
  search: params.get('search') || '',
  category: params.get('category') || '',
  sort: params.get('sort') || 'newest',
});

const skeletonArray = Array.from({ length: 6 });

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => parseFilters(searchParams));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const current = parseFilters(searchParams);
    setFilters(current);
    fetchProducts(current);
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async (payload) => {
    setLoading(true);
    setError('');

    try {
      const result = await getProducts(payload);
      setProducts(result || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== defaultFilters[key]) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const activeFilters = useMemo(() => {
    const chips = [];
    if (filters.category) chips.push({ label: `Category: ${filters.category}`, key: 'category' });
    if (filters.search) chips.push({ label: `Search: "${filters.search}"`, key: 'search' });
    if (filters.sort !== 'newest') chips.push({ label: `Sort: ${filters.sort.replace('_', ' ')}`, key: 'sort' });
    return chips;
  }, [filters]);

  return (
    <div className="space-y-16 text-ink">
      <Hero />
      <HighlightsCarousel />

      <section id="catalog" className="space-y-8 rounded-[32px] border border-slate-100 bg-white p-6 lg:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-ink/80">Discover</p>
            <h2 className="font-display text-3xl">Latest capsules</h2>
          </div>
          <p className="max-w-lg text-sm text-ink/80">
            Refine the drop to match your rituals. Search across tactile categories, filter by silhouette, and sort the
            release order.
          </p>
        </div>

        <form
          onSubmit={handleFilterSubmit}
          className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow ring-1 ring-slate-100 md:grid-cols-5"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="search" className="text-sm font-semibold text-ink/80">
              Search
            </label>
            <input
              id="search"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="e.g. Linen jacket"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-semibold text-ink/80">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="sort" className="text-sm font-semibold text-ink/80">
              Sort by
            </label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleInputChange}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
            </select>
          </div>

          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="mt-6 w-full rounded-2xl bg-primary px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 md:mt-auto">
              Apply
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-6 w-full rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-ink transition hover:border-primary md:mt-auto"
            >
              Clear
            </button>
          </div>
        </form>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {activeFilters.map((chip) => (
              <span
                key={chip.key}
                className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-ink/80"
              >
                {chip.label}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-ink/80">
          Showing <span className="font-semibold text-ink">{products.length}</span> pieces curated for you
        </p>

        <div id="new-arrivals" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            skeletonArray.map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="h-[360px] rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow ring-1 ring-slate-100 animate-pulse"
              >
                <div className="mb-4 h-48 rounded-2xl bg-white/10" />
                <div className="mb-2 h-4 rounded-full bg-white/10" />
                <div className="mb-2 h-4 w-3/4 rounded-full bg-white/10" />
                <div className="h-4 w-1/2 rounded-full bg-white/10" />
              </div>
            ))}

          {!loading && error && (
            <div className="col-span-full rounded-2xl bg-red-500/10 px-6 py-4 text-red-700">{error}</div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="col-span-full rounded-2xl border border-slate-100 bg-white p-10 text-center text-ink/80">
              No products found. Try adjusting your filters.
            </div>
          )}

          {!loading &&
            !error &&
            products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <LookbookStrip />
    </div>
  );
};

export default Home;

