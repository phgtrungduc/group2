import { Router } from 'express';
import { TuitionController } from '../controllers/tuition.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const tuitionController = new TuitionController();

router.use(authenticateJWT);

router.get('/student/:studentId', tuitionController.getTuitionByStudent.bind(tuitionController));
router.post('/payment', tuitionController.addPayment.bind(tuitionController));

export default router;
