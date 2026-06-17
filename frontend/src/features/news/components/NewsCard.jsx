import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Heart, Bookmark, MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../../../store/useAuthStore';
import CommentsDrawer from '../components/CommentsDrawer';
import { useLikeNews, useSaveNews } from '../hooks';

export default function NewsCard({ article, maxTags = 3 }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, fetchProfile } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: likeNews, isPending: isLikePending } = useLikeNews();
  const { mutate: saveNews, isPending: isSavePending } = useSaveNews();

  const [likesCount, setLikesCount] = useState(article.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentsCount, setCommentsCount] = useState(article.commentsCount || 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const savedNewsIds = user.savedNews?.map(n => n.id || n._id || n) || [];
      setIsSaved(savedNewsIds.includes(article.id || article._id));
    } else {
      setIsSaved(false);
    }
  }, [user, article.id, article._id]);

  useEffect(() => {
    if (user) {
      const userId = user.id || user._id;
      const hasLiked = article.likes?.some(like => like === userId || like._id === userId);
      setIsLiked(!!hasLiked);
    } else {
      setIsLiked(false);
    }
    setLikesCount(article.likes?.length || 0);
    setCommentsCount(article.commentsCount || 0);
  }, [article.likes, article.commentsCount, user?.id, user?._id]);

  const handleLike = () => {
    if (!isAuthenticated) return navigate('/login');

    const wasLiked = isLiked;

    setIsLiked(!wasLiked);

    setLikesCount(prev => Math.max(0, prev + (wasLiked ? -1 : 1)));

    likeNews(article.id || article._id, {
      onError: () => {
        setIsLiked(wasLiked);
        setLikesCount(prev => Math.max(0, prev + (wasLiked ? 1 : -1)));
        console.error('Не вдалося оновити лайк');
      }
    });
  };

  const handleSave = () => {
    if (!isAuthenticated) return navigate('/login');

    const wasSaved = isSaved;

    setIsSaved(!wasSaved);

    saveNews(article.id || article._id, {
      onSuccess: () => {
        fetchProfile();
      },
      onError: () => {
        setIsSaved(wasSaved);
        console.error('Не вдалося оновити збережене');
      }
    });
  };

  const formattedDate = new Date(article.createdAt).toLocaleDateString('uk-UA', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <article className="group flex flex-col bg-bg border border-border rounded-xl overflow-hidden hover:border-muted transition-colors duration-300">

      {article.image && (
        <div className="w-full h-48 overflow-hidden border-b border-border bg-fg/5 relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-fg tracking-wider uppercase">
            {article.source}
          </span>
          {article.category && (
            <span className="text-[10px] font-mono px-2 py-0.5 border border-border rounded-full text-muted">
              {article.category.name || article.category}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold tracking-tight mb-2 line-clamp-2 hover:text-industrial-accent transition-colors">
          <a href={article.sourceLink} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h2>

        <p className="text-sm text-muted mb-4 line-clamp-3 flex-grow">
          {article.description}
        </p>

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, maxTags).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-mono bg-fg/5 text-muted px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <time className="text-xs text-muted font-mono">{formattedDate}</time>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="flex items-center gap-1 text-muted hover:text-fg transition-colors"
            >
              <MessageSquare size={16} />
              <span className="text-xs font-mono">{commentsCount}</span>
            </button>

            <button
              onClick={handleLike}
              disabled={isLikePending}
              className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'text-muted hover:text-red-500'
                } ${isLikePending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              <span className="text-xs font-mono">{likesCount}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSavePending}
              className={`transition-colors ${isSaved ? 'text-industrial-accent' : 'text-muted hover:text-industrial-accent'
                } ${isSavePending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
            </button>

            <a href={article.sourceLink} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg transition-colors ml-1">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        newsId={article.id || article._id}
        articleTitle={article.title}
        onCommentAdded={() => {
          setCommentsCount(prev => prev + 1);
          queryClient.invalidateQueries({ queryKey: ['news'] });
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }}
        onCommentDeleted={() => {
          setCommentsCount(prev => Math.max(0, prev - 1));
          queryClient.invalidateQueries({ queryKey: ['news'] });
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }}
      />
    </article>
  );
}