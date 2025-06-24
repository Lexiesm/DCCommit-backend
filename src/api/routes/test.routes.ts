import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Todo bien!');
});

export default router;
