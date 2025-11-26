import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAuth } from './test-utils.jsx';
import ProductPage from '../src/pages/ProductPage.jsx';
import * as productService from '../src/services/productService.js';
import Cart from '../src/pages/Cart.jsx';
import * as cartService from '../src/services/cartService.js';

vi.mock('react-hot-toast');

describe('Cart UI', () => {
  beforeEach(() => vi.restoreAllMocks());

  test('ProductPage Add to cart calls addItem', async () => {
    const spy = vi.spyOn(cartService, 'addItem').mockResolvedValue({ items: [] });

    // product service should resolve a product so the component renders the Add to cart button
    vi.spyOn(productService, 'getProductById').mockResolvedValue({ _id: '1', name: 'Sample', price: 9.99, description: 'Desc', image: '', category: 'apparel', inStock: true });
    vi.spyOn(productService, 'getProducts').mockResolvedValue([]);

    renderWithAuth(
      <Routes>
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>,
      { initialEntries: ['/products/1'], user: { _id: 'u1' }, token: 't1' }
    );

    const btn = await screen.findByRole('button', { name: /add to cart/i });
    await userEvent.click(btn);

    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  test('Cart page shows items and handles updates/removes', async () => {
    const mockCart = { items: [{ _id: 'ci1', product: { _id: 'p1', name: 'Prod One', price: 10, image: '' }, quantity: 2, priceAtAdd: 10 }] };
    vi.spyOn(cartService, 'getCart').mockResolvedValue(mockCart);
    vi.spyOn(cartService, 'updateItem').mockImplementation((id, payload) => Promise.resolve({ ...mockCart, items: [{ ...mockCart.items[0], quantity: payload.quantity }] }));
    vi.spyOn(cartService, 'removeItem').mockResolvedValue({ ...mockCart, items: [] });
    vi.spyOn(cartService, 'checkout').mockResolvedValue({ _id: 'o1', total: 20 });

    renderWithAuth(<Cart />, { user: { _id: 'u1' }, token: 't1' });

    // initial load
    expect(await screen.findByText(/Prod One/)).toBeTruthy();

    // update
    const qty = screen.getByRole('spinbutton');
    await userEvent.clear(qty);
    await userEvent.type(qty, '3');

    await waitFor(() => expect(cartService.updateItem).toHaveBeenCalled());

    // remove
    const remove = screen.getByRole('button', { name: /remove/i });
    await userEvent.click(remove);
    await waitFor(() => expect(cartService.removeItem).toHaveBeenCalled());
  });

  test('Cart page checkout calls checkout', async () => {
    const mockCart = { items: [{ _id: 'ci1', product: { _id: 'p1', name: 'Prod One', price: 10, image: '' }, quantity: 2, priceAtAdd: 10 }] };
    vi.spyOn(cartService, 'getCart').mockResolvedValue(mockCart);
    vi.spyOn(cartService, 'checkout').mockResolvedValue({ total: 20 });

    renderWithAuth(<Cart />, { user: { _id: 'u1' }, token: 't1' });

    expect(await screen.findByText(/Prod One/)).toBeTruthy();

    const checkout = screen.getByRole('button', { name: /checkout/i });
    await userEvent.click(checkout);
    await waitFor(() => expect(cartService.checkout).toHaveBeenCalled());

    // order confirmation should show
    expect(await screen.findByText(/order placed/i)).toBeTruthy();
    // ensure total is displayed
    expect(screen.getByText(/total: \$20.00/i)).toBeTruthy();
  });
});
