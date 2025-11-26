import api from '../api';

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data.data;
};

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};

export const forgot = async (payload) => {
  const { data } = await api.post('/auth/forgot', payload);
  return data;
};

export const reset = async (token, payload) => {
  const { data } = await api.post(`/auth/reset/${token}`, payload);
  return data;
};

