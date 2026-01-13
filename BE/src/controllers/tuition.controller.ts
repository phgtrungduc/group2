import { Request, Response, NextFunction } from 'express';
import { TuitionRepository } from '../repositories/tuition.repository';

export class TuitionController {
  private tuitionRepo: TuitionRepository;

  constructor() {
    this.tuitionRepo = new TuitionRepository();
  }

  // GET /api/tuition/student/:studentId - Lấy tất cả học phí của student với computed fields
  async getTuitionByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const tuition = await this.tuitionRepo.findByStudent(studentId);
      res.status(200).json({ success: true, data: tuition });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/tuition/payment - Thêm payment cho học phí
  async addPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { tuition_id, payment_amount, payment_method, transaction_id, remarks } = req.body;
      
      if (!tuition_id || !payment_amount) {
        return res.status(400).json({ 
          success: false, 
          error: 'tuition_id and payment_amount are required' 
        });
      }

      // Insert vào tuition_payments table
      const connection = await this.tuitionRepo['getConnection']();
      try {
        const [result] = await connection.execute(
          `INSERT INTO tuition_payments (id, tuition_id, payment_amount, payment_method, transaction_id, remarks, created_by)
           VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
          [tuition_id, payment_amount, payment_method || 'cash', transaction_id, remarks, (req as any).user?.id]
        );
        
        connection.release();
        
        // Trigger sẽ tự động update tuition table
        res.status(201).json({ success: true, message: 'Payment added successfully' });
      } catch (error) {
        connection.release();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }
}
