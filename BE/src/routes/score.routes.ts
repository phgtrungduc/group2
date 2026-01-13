import { Router } from 'express';
import { ScoreController } from '../controllers/score.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const scoreController = new ScoreController();

router.use(authenticateJWT);

router.get('/student/:studentId', scoreController.getScoresByStudent.bind(scoreController));
router.post('/', scoreController.upsertScore.bind(scoreController));

export default router;
