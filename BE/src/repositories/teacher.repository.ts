import { BaseRepository } from './base.repository';
import { Teacher, TeacherFull, CreateTeacherDto } from '../models';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export class TeacherRepository extends BaseRepository<Teacher> {
  constructor() {
    super('teachers');
  }

  /**
   * Get all teachers with user data
   */
  async findAllFull(): Promise<TeacherFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.username,
        u.name,
        u.email,
        u.role
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;
    return this.query<TeacherFull>(sql);
  }

  /**
   * Get teacher by ID with user data
   */
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

  /**
   * Find teacher by teacher code
   */
  async findByTeacherCode(teacherCode: string): Promise<Teacher | null> {
    return this.queryOne<Teacher>(
      `SELECT * FROM ${this.tableName} WHERE teacher_code = ?`,
      [teacherCode]
    );
  }

  /**
   * Find teacher by user_id
   */
  async findByUserId(userId: string): Promise<Teacher | null> {
    return this.queryOne<Teacher>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );
  }

  /**
   * Find teachers by department
   */
  async findByDepartment(department: string): Promise<TeacherFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.username,
        u.name,
        u.email,
        u.role
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.department = ?
      ORDER BY t.teacher_code
    `;
    return this.query<TeacherFull>(sql, [department]);
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
         VALUES (?, ?, ?, 2, ?, ?)`,
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

  /**
   * Check if teacher code exists
   */
  async existsByTeacherCode(teacherCode: string): Promise<boolean> {
    const result = await this.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE teacher_code = ?`,
      [teacherCode]
    );
    return (result?.count || 0) > 0;
  }
}
