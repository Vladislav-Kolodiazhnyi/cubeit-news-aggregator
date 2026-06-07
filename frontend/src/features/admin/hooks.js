import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from './api';

export const useAdminStats = (enabled) => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.fetchAdminStats,
    enabled: !!enabled,
    staleTime: 30 * 1000,
  });
};

export const useAdminNews = (page, limit) => {
  return useQuery({
    queryKey: ['admin', 'news', { page, limit }],
    queryFn: () => adminApi.fetchAdminNews(page, limit),
    staleTime: 10 * 1000,
  });
};

export const useUpdateAdminNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateAdminNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });
};

export const useDeleteAdminNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteAdminNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });
};

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminApi.fetchAdminCategories,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useAdminUsers = (page, limit) => {
  return useQuery({
    queryKey: ['admin', 'users', { page, limit }],
    queryFn: () => adminApi.fetchAdminUsers(page, limit),
    staleTime: 30 * 1000,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    }
  });
};

export const useTriggerParsing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.triggerNewsParsing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });
};