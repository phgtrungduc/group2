import { BaseRepository } from './base.repository';
import { Student, StudentFull, CreateStudentDto } from '../models';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export class StudentRepository extends BaseRepository<Student> {
  constructor() {
    super('students');
  }

  async findByIdFull(id: string): Promise<StudentFull | null> {
    const sql = `
      SELECT 
        s.*,
        u.username,
        u.code,
        u.name,
        u.email,
        u.role
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `;
    return this.queryOne<StudentFull>(sql, [id]);
  }

  async findByUserId(userId: string): Promise<Student | null> {
    return this.queryOne<Student>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );
  }

  /**
   * Create student with user (Transaction)
   */
  async createWithUser(data: CreateStudentDto): Promise<StudentFull> {
    const connection = await this.getConnection();
    
    try {
      await connection.beginTransaction();

      const userId = uuidv4();
      const studentId = uuidv4();
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Insert user
      await connection.execute(
        `INSERT INTO users (id, username, password, role, code, name, email) 
         VALUES (?, ?, ?, 2, ?, ?, ?)`,
        [userId, data.username, hashedPassword, data.code, data.name, data.email]
      );

      // Insert student
      await connection.execute(
        `INSERT INTO students (id, user_id, year_level) 
         VALUES (?, ?, ?)`,
        [studentId, userId, data.year_level]
      );

      // Create tuition record
      const tuitionAmount = data.year_level === 1 ? 400000000 : data.year_level === 2 ? 450000000 : 500000000;
      const totalAmount = tuitionAmount * 12;
      const academicYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

      await connection.execute(
        `INSERT INTO tuition (id, student_id, year_level, academic_year, amount_per_month, total_months, total_amount, paid_amount, remaining_amount, status) 
         VALUES (?, ?, ?, ?, ?, 12, ?, 0, ?, 'pending')`,
        [uuidv4(), studentId, data.year_level, academicYear, tuitionAmount, totalAmount, totalAmount]
      );

      await connection.commit();
      connection.release();

      // Return full student data
      return (await this.findByIdFull(studentId))!;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }
}
