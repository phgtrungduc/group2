import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../repositories/student.repository';

export class StudentController {
  private studentRepo: StudentRepository;

  constructor() {
    this.studentRepo = new StudentRepository();
  }

  // GET /api/students - Lấy tất cả students
  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await this.studentRepo.findAll();
      res.status(200).json({ success: true, data: students });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/with-scores - Lấy tất cả students với điểm số
  async getAllStudentsWithScores(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await this.studentRepo.findAllWithScores();
      res.status(200).json({ success: true, data: students });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:id - Lấy student theo ID (full info with user)
  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await this.studentRepo.findByIdFull(id);
      
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      
      res.status(200).json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/students/:id - Update student
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body; // { name, email, year_level }
      
      const updated = await this.studentRepo.updateStudentWithUser(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/students/:id - Delete student
  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await this.studentRepo.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      
      res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
