import { Router } from 'express';
import { processMessage } from '../core/agent-v2.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const response = await processMessage(userId, message);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
