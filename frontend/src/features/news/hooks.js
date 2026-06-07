import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchCategories,
  fetchInfiniteNews,
  fetchSources,
  toggleLikeNews,
  toggleSaveNews,
  fetchComments,
  createComment,
  deleteComment,
} from "./api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
  });
};

export const useInfiniteNews = (categorySlug, source, sort) => {
  return useInfiniteQuery({
    queryKey: ["news", "infinite", { categorySlug, source, sort }],
    queryFn: ({ pageParam = 1 }) =>
      fetchInfiniteNews({ pageParam, categorySlug, source, sort }),
    getNextPageParam: (lastPage, allPages) => {
      const isArray = Array.isArray(lastPage);
      const fetchedNews = isArray ? lastPage : lastPage?.news || [];
      const totalPages = isArray ? null : lastPage?.totalPages || 1;

      if (isArray) {
        return fetchedNews.length === 9 ? allPages.length + 1 : undefined;
      } else {
        return allPages.length < totalPages ? allPages.length + 1 : undefined;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSources = () => {
  return useQuery({
    queryKey: ["news", "sources"],
    queryFn: fetchSources,
    staleTime: 10 * 60 * 1000,
  });
};

export const useLikeNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newsId) => toggleLikeNews(newsId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useSaveNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newsId) => toggleSaveNews(newsId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useComments = (newsId, isOpen) => {
  return useQuery({
    queryKey: ["comments", newsId],
    queryFn: () => fetchComments(newsId),
    enabled: !!newsId && isOpen,
    staleTime: 10 * 1000,
  });
};

export const useCreateComment = (newsId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text }) => createComment({ newsId, text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", newsId] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useDeleteComment = (newsId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", newsId] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};
