import { BaseRepository } from './base.repository';
import { Test, TestFull } from '../models';

export class TestRepository extends BaseRepository<Test> {
  constructor() {
    super('tests');
  }

  /**
   * Get all tests with related data
   */
  async findAllFull(): Promise<TestFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.name as student_name,
        s.student_code,
        subj.subject_name,
        subj.subject_code,
        ut.name as teacher_name
      FROM tests t
      JOIN students s ON t.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN subjects subj ON t.subject_id = subj.id
      LEFT JOIN teachers te ON t.teacher_id = te.id
      LEFT JOIN users ut ON te.user_id = ut.id
      ORDER BY t.test_date DESC
    `;
    return this.query<TestFull>(sql);
  }

  /**
   * Get tests by student ID
   */
  async findByStudentId(studentId: string): Promise<TestFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.name as student_name,
        s.student_code,
        subj.subject_name,
        subj.subject_code,
        ut.name as teacher_name
      FROM tests t
      JOIN students s ON t.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN subjects subj ON t.subject_id = subj.id
      LEFT JOIN teachers te ON t.teacher_id = te.id
      LEFT JOIN users ut ON te.user_id = ut.id
      WHERE t.student_id = ?
      ORDER BY t.test_date DESC
    `;
    return this.query<TestFull>(sql, [studentId]);
  }

  /**
   * Get tests by subject
   */
  async findBySubjectId(subjectId: string): Promise<TestFull[]> {
    const sql = `
      SELECT 
        t.*,
        u.name as student_name,
        s.student_code,
        subj.subject_name,
        subj.subject_code,
        ut.name as teacher_name
      FROM tests t
      JOIN students s ON t.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN subjects subj ON t.subject_id = subj.id
      LEFT JOIN teachers te ON t.teacher_id = te.id
      LEFT JOIN users ut ON te.user_id = ut.id
      WHERE t.subject_id = ?
      ORDER BY t.test_date DESC
    `;
    return this.query<TestFull>(sql, [subjectId]);
  }
}
