import { Request, Response, NextFunction } from 'express';
import { SubjectRepository } from '../repositories/subject.repository';

export class SubjectController {
  private subjectRepo: SubjectRepository;

  constructor() {
    this.subjectRepo = new SubjectRepository();
  }

  // GET /api/subjects - Lấy tất cả môn học
  async getAllSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { is_active } = req.query;
      const conditions: any = {};
      
      if (is_active !== undefined) {
        conditions.is_active = is_active === 'true' || is_active === '1';
      }
      
      const subjects = await this.subjectRepo.findAll(conditions);
      res.status(200).json({ success: true, data: subjects });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/subjects/:id - Lấy môn học theo ID
  async getSubjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const subject = await this.subjectRepo.findById(id);
      
      if (!subject) {
        return res.status(404).json({ success: false, error: 'Subject not found' });
      }
      
      res.status(200).json({ success: true, data: subject });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/subjects - Tạo môn học mới
  async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { subject_code, subject_name, is_active } = req.body;
      
      if (!subject_code || !subject_name) {
        return res.status(400).json({ 
          success: false, 
          error: 'subject_code and subject_name are required' 
        });
      }

      const subject = await this.subjectRepo.create({
        subject_code,
        subject_name,
        is_active
      });

      res.status(201).json({ success: true, data: subject });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/subjects/:id - Cập nhật môn học
  async updateSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updated = await this.subjectRepo.update(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Subject not found' });
      }
      
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/subjects/:id - Xóa môn học
  async deleteSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await this.subjectRepo.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Subject not found' });
      }
      
      res.status(200).json({ success: true, message: 'Subject deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
