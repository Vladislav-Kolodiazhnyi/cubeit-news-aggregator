import api from '../../api/axios';

export const fetchAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data.data;
};

export const fetchAdminNews = async (page = 1, limit = 10) => {
  const response = await api.get(`/news?page=${page}&limit=${limit}`);
  return response.data;
};

export const updateAdminNews = async ({ id, data }) => {
  const response = await api.put(`/news/${id}`, data);
  return response.data.data;
};

export const deleteAdminNews = async (id) => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};

export const fetchAdminCategories = async () => {
  const response = await api.get('/categories/all');
  return response.data.data || [];
};

export const createCategory = async (data) => {
  const response = await api.post('/categories', data);
  return response.data.data;
};

export const updateCategory = async ({ id, data }) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export const fetchAdminUsers = async (page = 1, limit = 10) => {
  const response = await api.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const updateUserRole = async ({ id, role }) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const triggerNewsParsing = async () => {
  const response = await api.post('/admin/parse');
  return response.data;
};