import { BaseRepository } from './base.repository';
import { Teacher, TeacherFull, CreateTeacherDto } from '../models';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export class TeacherRepository extends BaseRepository<Teacher> {
  constructor() {
    super('teachers');
  }

  async findByIdFull(id: string): Promise<TeacherFull | null> {
    const sql = `
      SELECT 
        t.*,
        u.username,
        u.name,
        u.email,
        u.role
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `;
    return this.queryOne<TeacherFull>(sql, [id]);
  }

  async findByUserId(userId: string): Promise<Teacher | null> {
    return this.queryOne<Teacher>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );
  }

  /**
   * Create teacher with user (Transaction)
   */
  async createWithUser(data: CreateTeacherDto): Promise<TeacherFull> {
    const connection = await this.getConnection();
    
    try {
      await connection.beginTransaction();

      const userId = uuidv4();
      const teacherId = uuidv4();
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Insert user
      await connection.execute(
        `INSERT INTO users (id, username, password, role, name, email) 
         VALUES (?, ?, ?, 3, ?, ?)`,
        [userId, data.username, hashedPassword, data.name, data.email]
      );

      // Insert teacher
      await connection.execute(
        `INSERT INTO teachers (id, user_id, teacher_code, department, specialization, phone, hire_date) 
         VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
        [teacherId, userId, data.teacher_code, data.department, data.specialization, data.phone]
      );

      await connection.commit();
      connection.release();

      // Return full teacher data
      return (await this.findByIdFull(teacherId))!;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }
}
