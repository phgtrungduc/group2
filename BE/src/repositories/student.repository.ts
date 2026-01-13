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

  async findAllWithScores(): Promise<any[]> {
    const sql = `
      SELECT 
        s.id as student_id,
        s.user_id,
        s.year_level,
        u.username,
        u.code,
        u.name,
        u.email,
        sc.id as score_id,
        sc.subject_id,
        sc.type as score_type,
        sc.score,
        sub.subject_code,
        sub.subject_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN scores sc ON s.id = sc.student_id
      LEFT JOIN subjects sub ON sc.subject_id = sub.id
      ORDER BY s.id, sub.subject_name, sc.type
    `;
    const rows = await this.query<any>(sql, []);
    
    // Group scores by student
    const studentsMap = new Map();
    
    rows.forEach(row => {
      if (!studentsMap.has(row.student_id)) {
        studentsMap.set(row.student_id, {
          id: row.student_id,
          user_id: row.user_id,
          year_level: row.year_level,
          username: row.username,
          code: row.code,
          name: row.name,
          email: row.email,
          scores: []
        });
      }
      
      if (row.score_id) {
        studentsMap.get(row.student_id).scores.push({
          id: row.score_id,
          subject_id: row.subject_id,
          subject_code: row.subject_code,
          subject_name: row.subject_name,
          type: row.score_type,
          score: parseFloat(row.score)
        });
      }
    });
    
    return Array.from(studentsMap.values());
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

  /**
   * Update student info (updates both user and student tables)
   */
  async updateStudentWithUser(studentId: string, data: Partial<{ name: string; email: string; year_level: number }>): Promise<StudentFull | null> {
    const connection = await this.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get student's user_id
      const student = await this.findById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // Update user table if name or email provided
      if (data.name || data.email) {
        const userUpdates: string[] = [];
        const userParams: any[] = [];

        if (data.name) {
          userUpdates.push('name = ?');
          userParams.push(data.name);
        }
        if (data.email) {
          userUpdates.push('email = ?');
          userParams.push(data.email);
        }

        if (userUpdates.length > 0) {
          userParams.push(student.user_id);
          await connection.execute(
            `UPDATE users SET ${userUpdates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            userParams
          );
        }
      }

      // Update student table if year_level provided
      if (data.year_level !== undefined) {
        await connection.execute(
          `UPDATE students SET year_level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [data.year_level, studentId]
        );
      }

      await connection.commit();
      connection.release();

      // Return updated student data
      return await this.findByIdFull(studentId);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }
}
