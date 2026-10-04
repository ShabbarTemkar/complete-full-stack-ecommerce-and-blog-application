const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /api/posts - Get all posts or filter by user/author
router.get('/', async (req, res) => {
  try {
    const { author } = req.query;
    let query = {};
    if (author) {
      query.author = { $regex: new RegExp(`^${author}$`, 'i') };
    }
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// POST /api/posts - Create a new blog post with validation
router.post('/', async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    // Basic Input Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters long' });
    }
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: 'Content must be at least 10 characters long' });
    }
    if (!author || author.trim().length === 0) {
      return res.status(400).json({ error: 'Author name is required' });
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category ? category.trim() : 'General'
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save blog post' });
  }
});

module.exports = router;