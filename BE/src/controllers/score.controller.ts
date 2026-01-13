import { Request, Response, NextFunction } from 'express';
import { ScoreRepository } from '../repositories/score.repository';

export class ScoreController {
  private scoreRepo: ScoreRepository;

  constructor() {
    this.scoreRepo = new ScoreRepository();
  }

  // GET /api/scores/student/:studentId - Lấy tất cả điểm của student
  async getScoresByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const scores = await this.scoreRepo.findAll({ student_id: studentId });
      res.status(200).json({ success: true, data: scores });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/scores - Tạo hoặc update điểm
  async upsertScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { student_id, subject_id, semester, year_level, midterm_score, final_score } = req.body;
      
      if (!student_id || !subject_id || !semester || !year_level) {
        return res.status(400).json({ 
          success: false, 
          error: 'student_id, subject_id, semester, year_level are required' 
        });
      }

      const score = await this.scoreRepo.create({
        student_id,
        subject_id,
        semester,
        year_level,
        midterm_score,
        final_score
      });

      res.status(201).json({ success: true, data: score });
    } catch (error) {
      next(error);
    }
  }
}
