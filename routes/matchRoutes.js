const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // yahan tera AI matching logic ayega
    res.json({ message: "Match route working", score: 85 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
