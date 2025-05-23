import { useState, useEffect } from 'react';
import API from '../api';

const Community = ({ onDeletePost = () => {} }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [game, setGame] = useState('');
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
        game
      });
      setPosts([response.data, ...posts]);
      setContent('');
      setGame('');
    } catch (err) {
      console.error('Failed to create post:', err.response?.data);
    }
  };

  // Check if current user can delete the post
  const canDeletePost = (post) => {
    if (!currentUser) return false;
    
    // Debug logs
    console.log('Current User:', currentUser);
    console.log('Post Author:', post.author);
    
    return (
      currentUser.role === 'admin' || 
      currentUser._id === post.author?._id
    );
  };

  const handleDelete = async (e, post) => {
    e.stopPropagation();
    try {
      const response = await API.delete(`/api/community/${post._id}`);
      
      if (response.data.success) {
        setPosts(posts.filter(p => p._id !== post._id));
        onDeletePost(post._id);
      } else {
        console.error('Delete failed:', response.data.message);
        alert(response.data.message || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Delete error:', {
        status: err.response?.status,
        data: err.response?.data,
        error: err.message
      });
      alert(err.response?.data?.message || 'Error deleting post');
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;