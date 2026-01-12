import { BaseRepository } from './base.repository';
import { Tuition, TuitionFull, TuitionPayment, CreatePaymentDto } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class TuitionRepository extends BaseRepository<Tuition> {
  constructor() {
    super('tuition');
  }

  /**
   * Get all tuition with student data
   */
  async findAllFull(): Promise<TuitionFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.name as student_name,
        s.student_code
      FROM tuition t
      JOIN students s ON t.student_id = s.id
      JOIN users u ON s.user_id = u.id
      ORDER BY t.academic_year DESC, t.year_level
    `;
    return this.query<TuitionFull>(sql);
  }

  /**
   * Get tuition by student ID
   */
  async findByStudentId(studentId: string): Promise<TuitionFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.name as student_name,
        s.student_code
      FROM tuition t
      JOIN students s ON t.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE t.student_id = ?
      ORDER BY t.academic_year DESC
    `;
    return this.query<TuitionFull>(sql, [studentId]);
  }

  /**
   * Get tuition by status
   */
  async findByStatus(status: 'pending' | 'partial' | 'completed'): Promise<TuitionFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.name as student_name,
        s.student_code
      FROM tuition t
      JOIN students s ON t.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE t.status = ?
      ORDER BY t.academic_year DESC
    `;
    return this.query<TuitionFull>(sql, [status]);
  }

  /**
   * Add payment to tuition
   */
  async addPayment(data: CreatePaymentDto): Promise<TuitionPayment> {
    const connection = await this.getConnection();
    
    try {
      await connection.beginTransaction();

      const paymentId = uuidv4();

      // Insert payment
      await connection.execute(
        `INSERT INTO tuition_payments (id, tuition_id, payment_amount, payment_method, transaction_id, remarks, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [paymentId, data.tuition_id, data.payment_amount, data.payment_method, data.transaction_id, data.remarks, data.created_by]
      );

      await connection.commit();
      connection.release();

      // Trigger will auto-update tuition status
      // Return payment
      const [rows] = await this.pool.execute(
        'SELECT * FROM tuition_payments WHERE id = ?',
        [paymentId]
      );
      return (rows as any[])[0];
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  /**
   * Get payments for tuition
   */
  async getPayments(tuitionId: string): Promise<TuitionPayment[]> {
    return this.query<TuitionPayment>(
      'SELECT * FROM tuition_payments WHERE tuition_id = ? ORDER BY payment_date DESC',
      [tuitionId]
    );
  }
}
