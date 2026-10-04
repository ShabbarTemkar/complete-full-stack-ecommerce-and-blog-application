const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - List all products or filter by search query
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// POST /api/products/seed - Add initial catalog items if database is empty
router.post('/seed', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return res.json({ message: 'Catalog already seeded', count });

    const seedItems = [
      {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Over-ear studio sound with active hybrid ANC and 40h battery.',
        price: 99.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Minimalist Mechanical Keyboard',
        description: 'RGB backlighting, tactile switches, hot-swappable PCB.',
        price: 74.50,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Ergonomic Desk Chair',
        description: 'Breathable mesh back with adjustable lumbar and armrests.',
        price: 189.00,
        category: 'Furniture',
        imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a8220e529b?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Smart Fitness Tracker',
        description: 'Heart rate, sleep tracking, waterproof 5ATM sports smartwatch.',
        price: 49.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const inserted = await Product.insertMany(seedItems);
    res.status(201).json({ message: 'Catalog successfully seeded', inserted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

module.exports = router;