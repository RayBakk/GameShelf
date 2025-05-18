const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const auth = require('../middleware/authMiddleware');

// Create post
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

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;