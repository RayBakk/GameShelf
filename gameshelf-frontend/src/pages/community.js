import { useState, useEffect } from 'react';
import API from '../api';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [game, setGame] = useState('');
  const [replyContent, setReplyContent] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(userData);

    const fetchPosts = async () => {
      try {
        const response = await API.get('/api/community');
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/community', {
        content,
        game,
      });

      const userData = JSON.parse(localStorage.getItem('user'));

      const newPostWithAuthor = {
        ...response.data,
        author: {
          _id: userData._id,
          username: userData.username,
          role: userData.role,
        },
        replies: [],
      };

      setPosts([newPostWithAuthor, ...posts]);
      setContent('');
      setGame('');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    const replyText = replyContent[postId]?.trim();
    if (!replyText) return;

    try {
      const response = await API.post(`/api/community/${postId}/replies`, {
        content: replyText,
      });

      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            replies: [...(post.replies || []), response.data],
          };
        }
        return post;
      }));

      setReplyContent(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  const canDeletePost = (post) => {
    if (!currentUser) return false;

    return (
      currentUser.role === 'admin' ||
      currentUser._id === post.author?._id
    );
  };

  const handleDelete = async (e, post) => {
    e.stopPropagation();
    try {
      setPosts(posts.filter(p => p._id !== post._id));
      await API.delete(`/api/community/${post._id}`);
    } catch (err) {
      setPosts(posts);
      console.error('Delete error:', err);
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
  try {
    await API.delete(`/api/community/${postId}/replies/${replyId}`);
    setPosts(posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          replies: post.replies.filter(r => r._id !== replyId)
        };
      }
      return post;
    }));
  } catch (err) {
    console.error('Failed to delete reply:', err);
  }
};

  return (
    <div className="community-container">
      <h1 className="community-title">Game Discussions</h1>

      <form onSubmit={handleSubmit} className="community-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Game title"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Share your thoughts about the game..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength="10"
            className="form-textarea"
          />
        </div>
        <button className="submit-button" type="submit">Post</button>
      </form>

      <div className="posts-container">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <h3 className="post-game">{post.game}</h3>
              {canDeletePost(post) && (
                <button
                  className={`delete-post-button ${currentUser?.role === 'admin' ? 'admin-delete' : ''}`}
                  onClick={(e) => handleDelete(e, post)}
                >
                  {currentUser?.role === 'admin' ? 'Admin Delete' : 'Delete'}
                </button>
              )}
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-footer">
              <span className="post-author">Posted by: {post.author.username}</span>
              <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
            </div>

            <div className="replies-container">
              {(post.replies || []).map(reply => (
            <div key={reply._id} className="reply-card">
              <p className="reply-content">{reply.content}</p>
              <div className="reply-footer">
                <span className="reply-author">{reply.author.username}</span> |{' '}
                <span>{new Date(reply.createdAt).toLocaleString()}</span>
                {currentUser && (currentUser.role === 'admin' || currentUser._id === reply.author._id) && (
                  <button
                    className="reply-delete-btn"
                    onClick={() => handleDeleteReply(post._id, reply._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
          </div>
          ))}
          </div>
            <form onSubmit={(e) => handleReplySubmit(e, post._id)} className="reply-form">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyContent[post._id] || ''}
                onChange={(e) =>
                  setReplyContent({ ...replyContent, [post._id]: e.target.value })
                }
                required
                className="reply-input"
              />
              <button type="submit" className="reply-submit-btn">Reply</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
