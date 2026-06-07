import api from '../../api/axios';

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data.data || [];
};

export const fetchInfiniteNews = async ({ pageParam = 1, categorySlug = null, source = null, sort = null }) => {
  let url = `/news?page=${pageParam}&limit=9`;
  
  if (categorySlug) url += `&category=${categorySlug}`;
  if (source) url += `&source=${encodeURIComponent(source)}`;
  if (sort) url += `&sort=${sort}`;
  
  const response = await api.get(url);
  return response.data.data;
};

export const toggleLikeNews = async (newsId) => {
  const response = await api.post(`/news/${newsId}/like`);
  return response.data;
};

export const toggleSaveNews = async (newsId) => {
  const response = await api.post(`/news/${newsId}/save`);
  return response.data;
};

export const fetchSources = async () => {
  const response = await api.get('/news/sources');
  return response.data.data || [];
};

export const fetchComments = async (newsId) => {
  const response = await api.get(`/comments/news/${newsId}`);
  return response.data.data || [];
};

export const createComment = async ({ newsId, text }) => {
  const response = await api.post(`/comments/news/${newsId}`, { text });
  return response.data.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};