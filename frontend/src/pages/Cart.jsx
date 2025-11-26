import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';
import * as cartService from '../services/cartService.js';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      toast.error('Unable to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId, qty) => {
    try {
      const data = await cartService.updateItem(productId, { quantity: qty });
      setCart(data);
    } catch (err) {
      toast.error('Unable to update item');
    }
  };

  const handleRemove = async (productId) => {
    try {
      const data = await cartService.removeItem(productId);
      setCart(data);
    } catch (err) {
      toast.error('Unable to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      const data = await cartService.checkout();
      setOrder(data);
      toast.success('Order placed — total: $' + data.total.toFixed(2));
      setCart({ ...cart, items: [] });
    } catch (err) {
      toast.error('Unable to checkout');
    }
  };

  if (!user) return <div className="rounded-2xl bg-white p-8 text-center">Please log in to view your cart</div>;

  if (loading) return <div className="rounded-2xl bg-white p-8">Loading…</div>;

  return (
    <div className="rounded-3xl bg-white p-8">
          {order && (
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 mb-6" role="status" aria-live="polite">
              <h3 className="text-lg font-semibold text-ink">Order placed</h3>
              <p className="text-sm text-ink/70 mt-2">Order #{order._id} — total: ${order.total?.toFixed(2)}</p>
            </div>
          )}
      <h2 className="text-2xl font-semibold text-ink mb-4">Your cart</h2>

      {cart?.items?.length === 0 && <p className="text-ink/70">Your cart is empty.</p>}

      {cart?.items?.length > 0 && (
        <div className="space-y-4">
          {cart.items.map((it) => (
            <div key={it._id || it.product._id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                {it.product.image ? <img src={it.product.image} alt={it.product.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center">{it.product.name?.charAt(0)}</div>}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-ink">{it.product.name}</div>
                    <div className="text-sm text-ink/70">{it.product.category}</div>
                  </div>
                  <div className="font-semibold text-ink">${(it.priceAtAdd * it.quantity).toFixed(2)}</div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <input type="number" value={it.quantity} min={1} onChange={(e) => handleUpdate(it.product._id, Number(e.target.value))} className="w-20 rounded-xl border border-slate-200 px-3 py-2" />
                  <button onClick={() => handleRemove(it.product._id)} className="text-sm text-primary hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-ink/70">Total</div>
            <div className="font-semibold text-ink">${(cart.items.reduce((s, i) => s + i.priceAtAdd * i.quantity, 0)).toFixed(2)}</div>
          </div>

          <div className="mt-4">
            <Button variant="primary" onClick={handleCheckout}>Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
