const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      game: req.body.game,
      author: req.user._id
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username _id role');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isAuthor = post.author.equals(req.user._id);
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

module.exports = router;