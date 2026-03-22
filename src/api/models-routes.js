import { Router } from 'express';
import { modelManager } from '../core/model-manager.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    active: modelManager.getActiveModel(),
    models: modelManager.getAvailableModels()
  });
});

router.post('/switch', (req, res) => {
  try {
    const { modelId } = req.body;
    const result = modelManager.switchModel(modelId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
