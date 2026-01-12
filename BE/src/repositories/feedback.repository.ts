import { BaseRepository } from './base.repository';
import { Feedback, FeedbackFull, Schedule, ScheduleFull } from '../models';

export class FeedbackRepository extends BaseRepository<Feedback> {
  constructor() {
    super('feedbacks');
  }

  /**
   * Get all feedbacks with related data
   */
  async findAllFull(): Promise<FeedbackFull[]> {
    const sql = `
      SELECT 
        f.*,
        us.name as student_name,
        s.student_code,
        ut.name as teacher_name,
        subj.subject_name
      FROM feedbacks f
      JOIN students s ON f.student_id = s.id
      JOIN users us ON s.user_id = us.id
      LEFT JOIN teachers t ON f.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      LEFT JOIN subjects subj ON f.subject_id = subj.id
      ORDER BY f.created_at DESC
    `;
    return this.query<FeedbackFull>(sql);
  }

  /**
   * Get feedbacks by student ID
   */
  async findByStudentId(studentId: string): Promise<FeedbackFull[]> {
    const sql = `
      SELECT 
        f.*,
        us.name as student_name,
        s.student_code,
        ut.name as teacher_name,
        subj.subject_name
      FROM feedbacks f
      JOIN students s ON f.student_id = s.id
      JOIN users us ON s.user_id = us.id
      LEFT JOIN teachers t ON f.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      LEFT JOIN subjects subj ON f.subject_id = subj.id
      WHERE f.student_id = ?
      ORDER BY f.created_at DESC
    `;
    return this.query<FeedbackFull>(sql, [studentId]);
  }

  /**
   * Get feedbacks by teacher ID
   */
  async findByTeacherId(teacherId: string): Promise<FeedbackFull[]> {
    const sql = `
      SELECT 
        f.*,
        us.name as student_name,
        s.student_code,
        ut.name as teacher_name,
        subj.subject_name
      FROM feedbacks f
      JOIN students s ON f.student_id = s.id
      JOIN users us ON s.user_id = us.id
      LEFT JOIN teachers t ON f.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      LEFT JOIN subjects subj ON f.subject_id = subj.id
      WHERE f.teacher_id = ?
      ORDER BY f.created_at DESC
    `;
    return this.query<FeedbackFull>(sql, [teacherId]);
  }

  /**
   * Get pending feedbacks
   */
  async findPending(): Promise<FeedbackFull[]> {
    const sql = `
      SELECT 
        f.*,
        us.name as student_name,
        s.student_code,
        ut.name as teacher_name,
        subj.subject_name
      FROM feedbacks f
      JOIN students s ON f.student_id = s.id
      JOIN users us ON s.user_id = us.id
      LEFT JOIN teachers t ON f.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      LEFT JOIN subjects subj ON f.subject_id = subj.id
      WHERE f.status = 'pending'
      ORDER BY f.created_at DESC
    `;
    return this.query<FeedbackFull>(sql);
  }
}

export class ScheduleRepository extends BaseRepository<Schedule> {
  constructor() {
    super('schedules');
  }

  /**
   * Get all schedules with related data
   */
  async findAllFull(): Promise<ScheduleFull[]> {
    const sql = `
      SELECT 
        sch.*,
        subj.subject_name,
        subj.subject_code,
        u.name as teacher_name
      FROM schedules sch
      JOIN subjects subj ON sch.subject_id = subj.id
      JOIN teachers t ON sch.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE sch.is_active = TRUE
      ORDER BY sch.day_of_week, sch.start_time
    `;
    return this.query<ScheduleFull>(sql);
  }

  /**
   * Get schedules by year level
   */
  async findByYearLevel(yearLevel: number): Promise<ScheduleFull[]> {
    const sql = `
      SELECT 
        sch.*,
        subj.subject_name,
        subj.subject_code,
        u.name as teacher_name
      FROM schedules sch
      JOIN subjects subj ON sch.subject_id = subj.id
      JOIN teachers t ON sch.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE sch.year_level = ? AND sch.is_active = TRUE
      ORDER BY sch.day_of_week, sch.start_time
    `;
    return this.query<ScheduleFull>(sql, [yearLevel]);
  }

  /**
   * Get schedules by teacher ID
   */
  async findByTeacherId(teacherId: string): Promise<ScheduleFull[]> {
    const sql = `
      SELECT 
        sch.*,
        subj.subject_name,
        subj.subject_code,
        u.name as teacher_name
      FROM schedules sch
      JOIN subjects subj ON sch.subject_id = subj.id
      JOIN teachers t ON sch.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE sch.teacher_id = ? AND sch.is_active = TRUE
      ORDER BY sch.day_of_week, sch.start_time
    `;
    return this.query<ScheduleFull>(sql, [teacherId]);
  }
}
