import { Router } from 'express';
import { SubjectController } from '../controllers/subject.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const subjectController = new SubjectController();

router.use(authenticateJWT);

router.get('/', subjectController.getAllSubjects.bind(subjectController));
router.get('/:id', subjectController.getSubjectById.bind(subjectController));
router.post('/', subjectController.createSubject.bind(subjectController));
router.put('/:id', subjectController.updateSubject.bind(subjectController));
router.delete('/:id', subjectController.deleteSubject.bind(subjectController));

export default router;
