import api from '../../api/axios';

export const fetchCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data.data;
};

export const updateProfile = async (formData) => {
  const response = await api.patch('/users/me', formData);
  return response.data.data;
};