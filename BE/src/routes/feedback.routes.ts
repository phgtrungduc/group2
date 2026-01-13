import { Router } from 'express';
import { FeedbackController } from '../controllers/feedback.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const feedbackController = new FeedbackController();

router.use(authenticateJWT);

router.get('/', feedbackController.getAllFeedbacks.bind(feedbackController));
router.get('/student/:studentId', feedbackController.getFeedbacksByStudent.bind(feedbackController));
router.post('/', feedbackController.createFeedback.bind(feedbackController));
router.put('/:id/reply', feedbackController.replyFeedback.bind(feedbackController));

export default router;
