import api from '../api';

export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data.data;
};

export const addItem = async ({ productId, quantity = 1 }) => {
  const { data } = await api.post('/cart/item', { productId, quantity });
  return data.data;
};

export const updateItem = async (productId, { quantity }) => {
  const { data } = await api.put(`/cart/item/${productId}`, { quantity });
  return data.data;
};

export const removeItem = async (productId) => {
  const { data } = await api.delete(`/cart/item/${productId}`);
  return data.data;
};

export const checkout = async () => {
  const { data } = await api.post('/cart/checkout');
  return data.data;
};

export default { getCart, addItem, updateItem, removeItem, checkout };
