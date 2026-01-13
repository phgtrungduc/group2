import { Request, Response, NextFunction } from 'express';
import { FeedbackRepository } from '../repositories/feedback.repository';

export class FeedbackController {
  private feedbackRepo: FeedbackRepository;

  constructor() {
    this.feedbackRepo = new FeedbackRepository();
  }

  // GET /api/feedbacks - Lấy tất cả feedbacks
  async getAllFeedbacks(req: Request, res: Response, next: NextFunction) {
    try {
      const { student_id, status } = req.query;
      const conditions: any = {};
      
      if (student_id) conditions.student_id = student_id;
      if (status) conditions.status = status;
      
      const feedbacks = await this.feedbackRepo.findAll(conditions);
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/feedbacks/student/:studentId - Lấy feedbacks của student
  async getFeedbacksByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const feedbacks = await this.feedbackRepo.findAll({ student_id: studentId });
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/feedbacks/teacher/:teacherId - Lấy feedbacks của giáo viên (feedbacks mà giáo viên được đánh giá)
  async getFeedbacksByTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const { teacherId } = req.params;
      const connection = await this.feedbackRepo['getConnection']();
      try {
        const [rows] = await connection.execute(
          `SELECT f.*, 
                  u.name as student_name, u.code as student_code
           FROM feedbacks f
           JOIN students s ON f.student_id = s.id
           JOIN users u ON s.user_id = u.id
           WHERE f.teacher_id = ?
           ORDER BY f.created_at DESC`,
          [teacherId]
        );
        connection.release();
        res.status(200).json({ success: true, data: rows });
      } catch (error) {
        connection.release();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }

  // POST /api/feedbacks - Tạo feedback mới
  async createFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { student_id, teacher_id, message } = req.body;
      
      if (!student_id || !teacher_id || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'student_id, teacher_id and message are required' 
        });
      }

      const feedback = await this.feedbackRepo.create({
        student_id,
        teacher_id,
        message,
        status: 'pending'
      });

      res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/feedbacks/teachers - Lấy danh sách giáo viên
  async getTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const connection = await this.feedbackRepo['getConnection']();
      try {
        const [rows] = await connection.execute(
          'SELECT id, code, name, email FROM users WHERE role = 3 ORDER BY name ASC'
        );
        connection.release();
        res.status(200).json({ success: true, data: rows });
      } catch (error) {
        connection.release();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/feedbacks/:id/reply - Reply feedback
  async replyFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reply } = req.body;
      
      if (!reply) {
        return res.status(400).json({ success: false, error: 'reply is required' });
      }

      const updated = await this.feedbackRepo.update(id, { 
        reply,
        status: 'replied',
        replied_at: new Date()
      });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Feedback not found' });
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}
