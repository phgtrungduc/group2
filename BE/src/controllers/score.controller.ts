import { Request, Response, NextFunction } from 'express';
import { ScoreRepository } from '../repositories/score.repository';
import { ScoreType } from '../enums';

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
      const { student_id, subject_id, type, score } = req.body;
      
      if (!student_id || !subject_id || !type || score === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'student_id, subject_id, type, score are required' 
        });
      }

      // Validate score range
      if (score < 0 || score > 10) {
        return res.status(400).json({ 
          success: false, 
          error: 'Score must be between 0 and 10' 
        });
      }

      // Validate type is valid integer
      const typeInt = parseInt(type);
      if (isNaN(typeInt) || ![1, 2, 3, 4, 5].includes(typeInt)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid score type. Must be: 1=midterm, 2=final, 3=quiz, 4=assignment, 5=other' 
        });
      }

      const scoreData = await this.scoreRepo.create({
        student_id,
        subject_id,
        type: typeInt, // Store as integer
        score
      });

      res.status(201).json({ success: true, data: scoreData });
    } catch (error) {
      next(error);
    }
  }
}
