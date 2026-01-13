import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const scheduleController = new ScheduleController();

router.use(authenticateJWT);

router.get('/', scheduleController.getAllSchedules.bind(scheduleController));
router.get('/year-level/:yearLevel', scheduleController.getScheduleByYearLevel.bind(scheduleController));

export default router;
