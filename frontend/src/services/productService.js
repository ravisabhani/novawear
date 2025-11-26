import api from '../api';

export const getProducts = async (params) => {
  const { data } = await api.get('/products', { params });
  return data.data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post('/products', payload);
  return data.data;
};

export const getCategories = async () => {
  const { data } = await api.get('/products/categories');
  return data.data;
};

