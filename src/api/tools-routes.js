import { Router } from 'express';
import { executeSkill, getAvailableSkills } from '../core/skills.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(getAvailableSkills());
});

router.post('/execute', async (req, res) => {
  const { skillName, input } = req.body;
  const result = await executeSkill(skillName, input);
  res.json(result);
});

export default router;
