import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const studentController = new StudentController();

// Protect all routes
router.use(authenticateJWT);

router.get('/', studentController.getAllStudents.bind(studentController));
router.get('/with-scores', studentController.getAllStudentsWithScores.bind(studentController));
router.get('/:id', studentController.getStudentById.bind(studentController));
router.put('/:id', studentController.updateStudent.bind(studentController));
router.delete('/:id', studentController.deleteStudent.bind(studentController));

export default router;
