import { useState, useEffect } from 'react';
import { X, Send, Trash2, Loader2, MessageSquare, AlertTriangle } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import api from '../../../api/axios';

export default function CommentsDrawer({ isOpen, onClose, newsId, articleTitle, onCommentAdded, onCommentDeleted }) {
  const { user, isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else {
      document.body.style.overflow = 'unset';
      setCommentToDelete(null);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && newsId) {
      const fetchComments = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/comments/news/${newsId}`);
          setComments(response.data.data);
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchComments();
    }
  }, [isOpen, newsId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/comments/news/${newsId}`, { text: newComment });

      let newAddedComment = response.data.data;

      if (typeof newAddedComment.author === 'string' || !newAddedComment.author?.username) {
        newAddedComment.author = {
          _id: user.id || user._id,
          username: user.username,
          avatar: user.avatar
        };
      }

      setComments([newAddedComment, ...comments]);
      setNewComment('');

      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!commentToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/comments/${commentToDelete}`);

      setComments(comments.filter(c => (c.id || c._id) !== commentToDelete));
      if (onCommentDeleted) onCommentDeleted();

      setCommentToDelete(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-bg/50 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={() => !commentToDelete && onClose()}
      />

      <div className="relative w-full max-w-md h-full bg-bg border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-muted" />
            <h2 className="font-semibold tracking-tight">Коментарі</h2>
            <span className="text-xs font-mono bg-fg/10 text-fg px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </div>
          <button onClick={onClose} className="cursor-pointer p-1 text-muted hover:text-fg rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-3 bg-fg/[0.02] border-b border-border text-sm text-muted line-clamp-2">
          {articleTitle}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-muted" /></div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 text-muted">
              <p className="text-sm">Коментарів ще немає.</p>
              <p className="text-xs">Будьте першим, хто поділиться своїми думками!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const authorId = comment.author?._id || comment.author?.id || comment.author;
              const isOwner = user && (user.id === authorId || user._id === authorId);
              const isAdmin = user?.role === 'admin';

              return (
                <div key={comment.id || comment._id} className="group flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-border shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden border border-border">
                    {comment.author?.avatar ? (
                      <img src={`${BASE_URL}${comment.author.avatar}`} alt="Аватар" className="w-full h-full object-cover" />
                    ) : (
                      comment.author?.username?.charAt(0).toUpperCase() || '?'
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{comment.author?.username || 'Невідомий'}</span>
                        <span className="text-xs text-muted font-mono">
                          {new Date(comment.createdAt).toLocaleDateString('uk-UA')}
                        </span>
                      </div>

                      {(isOwner || isAdmin) && (
                        <button
                          onClick={() => setCommentToDelete(comment.id || comment._id)}
                          className="cursor-pointer opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-500 transition-all"
                          title="Видалити коментар"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-fg/90 mt-1 leading-relaxed whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-border bg-bg">
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Напишіть коментар..."
                className="flex-1 min-h-[40px] max-h-[120px] bg-fg/5 border border-border rounded-xl px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-industrial-accent resize-y cursor-text"
                rows="1"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="cursor-pointer disabled:cursor-not-allowed p-2.5 bg-fg text-bg rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0 mb-0.5"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          ) : (
            <div className="text-center py-2 px-4 bg-fg/5 rounded-lg border border-border">
              <p className="text-sm text-muted">
                Будь ласка, <a href="/login" className="text-industrial-accent hover:underline">увійдіть</a>, щоб залишити коментар.
              </p>
            </div>
          )}
        </div>

        {commentToDelete && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">Видалити коментар?</h3>
                <p className="text-sm text-muted">Цю дію не можна скасувати. Коментар буде видалено назавжди.</p>
              </div>
              <div className="flex border-t border-border bg-fg/[0.02]">
                <button
                  onClick={() => setCommentToDelete(null)}
                  disabled={isDeleting}
                  className="cursor-pointer disabled:cursor-not-allowed flex-1 py-3 text-sm font-medium text-fg hover:bg-fg/5 transition-colors border-r border-border disabled:opacity-50"
                >
                  Скасувати
                </button>
                <button
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="cursor-pointer disabled:cursor-not-allowed flex-1 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Видалити'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}