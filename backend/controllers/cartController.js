import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Get or create cart for user
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({ success: true, data: cart });
});

// Add or update an item in the cart
export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + Number(quantity), 9999);
  } else {
    cart.items.push({ product: product._id, quantity: Number(quantity), priceAtAdd: product.price });
  }

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({ success: true, data: cart });
});

// Update item quantity
export const updateItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (!existing) return res.status(404).json({ success: false, message: 'Item not in cart' });

  existing.quantity = Number(quantity) > 0 ? Number(quantity) : 0;

  // remove if zero
  cart.items = cart.items.filter((i) => i.quantity > 0);

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({ success: true, data: cart });
});

// Remove an item
export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();

  res.status(200).json({ success: true, data: cart });
});

// Checkout - create a simple order response (no payments) and clear cart
export const checkout = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ success: false, message: 'Cart is empty' });

  // Persist order and clear cart
  const orderPayload = {
    user: req.user._id,
    items: cart.items.map((i) => ({ product: i.product._id, quantity: i.quantity, price: i.priceAtAdd })),
    total: cart.items.reduce((sum, i) => sum + i.quantity * i.priceAtAdd, 0),
  };

  const savedOrder = await Order.create(orderPayload);

  // clear user's cart
  cart.items = [];
  await cart.save();

  res.status(200).json({ success: true, message: 'Order placed', data: savedOrder });
});
