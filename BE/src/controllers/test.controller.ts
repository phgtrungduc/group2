import { Request, Response, NextFunction } from 'express';
import { TestRepository } from '../repositories/test.repository';

export class TestController {
  private testRepo: TestRepository;

  constructor() {
    this.testRepo = new TestRepository();
  }

  // GET /api/tests/student/:studentId - Lấy tất cả tests của student
  async getTestsByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const tests = await this.testRepo.findAll({ student_id: studentId });
      res.status(200).json({ success: true, data: tests });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/tests - Tạo test mới
  async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const { student_id, subject_id, test_type, test_date, score, max_score, weight, remarks } = req.body;
      
      if (!student_id || !subject_id || !test_type || !test_date || score === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'student_id, subject_id, test_type, test_date, score are required' 
        });
      }

      const test = await this.testRepo.create({
        student_id,
        subject_id,
        test_type,
        test_date,
        score,
        max_score: max_score || 10,
        weight: weight || 1,
        remarks
      });

      res.status(201).json({ success: true, data: test });
    } catch (error) {
      next(error);
    }
  }
}
