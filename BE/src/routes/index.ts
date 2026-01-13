import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import subjectRoutes from './subject.routes';
import scoreRoutes from './score.routes';
import testRoutes from './test.routes';
import tuitionRoutes from './tuition.routes';
import scheduleRoutes from './schedule.routes';
import feedbackRoutes from './feedback.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/subjects', subjectRoutes);
router.use('/scores', scoreRoutes);
router.use('/tests', testRoutes);
router.use('/tuition', tuitionRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/feedbacks', feedbackRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
