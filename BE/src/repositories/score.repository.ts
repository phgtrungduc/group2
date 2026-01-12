import { BaseRepository } from './base.repository';
import { Score, ScoreFull, CreateScoreDto } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class ScoreRepository extends BaseRepository<Score> {
  constructor() {
    super('scores');
  }

  /**
   * Get all scores with related data
   */
  async findAllFull(): Promise<ScoreFull[]> {
    const sql = `
      SELECT 
        sc.*,
        u.name as student_name,
        s.student_code,
        subj.subject_name,
        subj.subject_code,
        ut.name as teacher_name
      FROM scores sc
      JOIN students s ON sc.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN subjects subj ON sc.subject_id = subj.id
      LEFT JOIN teachers t ON sc.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      ORDER BY sc.created_at DESC
    `;
    return this.query<ScoreFull>(sql);
  }

  /**
   * Get score by ID with related data
   */
  async findByIdFull(id: string): Promise<ScoreFull | null> {
    const sql = `
      SELECT 
        sc.*,
        u.name as student_name,
        s.student_code,
        subj.subject_name,
        subj.subject_code,
        ut.name as teacher_name
      FROM scores sc
      JOIN students s ON sc.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN subjects subj ON sc.subject_id = subj.id
      LEFT JOIN teachers t ON sc.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      WHERE sc.id = ?
    `;
    return this.queryOne<ScoreFull>(sql, [id]);
  }

  /**
   * Get scores by student ID
   */
  async findByStudentId(studentId: string): Promise<ScoreFull[]> {
    const sql = `
      SELECT 
        sc.*,
        u.name as student_name,
        s.student_code,
        subj.subject_name,
        subj.subject_code,
        ut.name as teacher_name
      FROM scores sc
      JOIN students s ON sc.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN subjects subj ON sc.subject_id = subj.id
      LEFT JOIN teachers t ON sc.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      WHERE sc.student_id = ?
      ORDER BY sc.year_level, sc.semester
    `;
    return this.query<ScoreFull>(sql, [studentId]);
  }

  /**
   * Get student GPA
   */
  async getStudentGPA(studentId: string): Promise<{ gpa: number; total_subjects: number } | null> {
    const sql = `
      SELECT 
        ROUND(AVG(average_score), 2) as gpa,
        COUNT(*) as total_subjects
      FROM scores
      WHERE student_id = ? AND average_score IS NOT NULL
    `;
    return this.queryOne(sql, [studentId]);
  }
}
