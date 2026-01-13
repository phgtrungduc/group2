import { Router } from 'express';
import { TestController } from '../controllers/test.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const testController = new TestController();

router.use(authenticateJWT);

router.get('/student/:studentId', testController.getTestsByStudent.bind(testController));
router.post('/', testController.createTest.bind(testController));

export default router;
