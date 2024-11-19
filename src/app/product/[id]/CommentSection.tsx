import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import StarRating from './StarRating';

interface Comment {
  _id: string;
  comment: string;
  rating: number;
  user_id: string;
  product_id: string;
  username?: string;
  createdAt: string;
}

interface CommentSectionProps {
  productId: string;
  initialComments?: Comment[];
}

const CommentSection = ({ productId, initialComments = [] }: CommentSectionProps) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/product/comments?product_id=${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError('Please log in to leave a comment');
      return;
    }
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      const response = await fetch('/api/product/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          rating,
          product_id: productId,
          user_id: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment('');
      setRating(0);
      setError(null);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Your Review</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={4}
            placeholder="Write your review here..."
          />
        </div>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={!session}
        >
          Submit Review
        </button>
        {!session && (
          <p className="text-sm text-gray-500 mt-2">Please log in to leave a review</p>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-2">
                <StarRating rating={comment.rating} readonly />
                <span className="ml-2 text-gray-600">
                  by {comment.username || 'Anonymous'}
                </span>
              </div>
              <p className="text-gray-800">{comment.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;