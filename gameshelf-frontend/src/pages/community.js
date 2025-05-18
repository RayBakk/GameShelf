import React, { useState, useEffect } from 'react';
import API from '../api';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [game, setGame] = useState('');

  useEffect(() => {
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

  return (
    <div className="community">
      <h1>Game Discussions</h1>
      
      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Game title"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          required
        />
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength="10"
        />
        <button type="submit">Post</button>
      </form>

      <div className="posts">
        {posts.map(post => (
          <div key={post._id} className="post">
            <h3>{post.game}</h3>
            <p>{post.content}</p>
            <small>Posted by: {post.author.username}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;