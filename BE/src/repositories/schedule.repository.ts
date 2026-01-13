import { BaseRepository } from './base.repository';
import { Schedule, ScheduleFull } from '../models/schedule.model';

export class ScheduleRepository extends BaseRepository<Schedule> {
  constructor() {
    super('schedules');
  }

  // Lấy lịch học với thông tin subject đầy đủ
  async findByIdFull(id: string): Promise<ScheduleFull | null> {
    const sql = `
      SELECT 
        sch.*,
        sub.subject_code,
        sub.subject_name
      FROM schedules sch
      JOIN subjects sub ON sch.subject_id = sub.id
      WHERE sch.id = ?
    `;
    return this.queryOne<ScheduleFull>(sql, [id]);
  }

  // Lấy lịch học theo năm học với thông tin subject
  async findByYearLevelFull(yearLevel: number, semester?: number, academicYear?: string): Promise<ScheduleFull[]> {
    let sql = `
      SELECT 
        sch.*,
        sub.subject_code,
        sub.subject_name
      FROM schedules sch
      JOIN subjects sub ON sch.subject_id = sub.id
      WHERE sch.year_level = ? AND sch.is_active = 1
    `;
    const params: any[] = [yearLevel];

    if (semester) {
      sql += ' AND sch.semester = ?';
      params.push(semester);
    }

    if (academicYear) {
      sql += ' AND sch.academic_year = ?';
      params.push(academicYear);
    }

    sql += ' ORDER BY FIELD(sch.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), sch.start_time';

    return this.query<ScheduleFull>(sql, params);
  }

  // Lấy tất cả lịch học với thông tin subject
  async findAllFull(conditions?: any): Promise<ScheduleFull[]> {
    let sql = `
      SELECT 
        sch.*,
        sub.subject_code,
        sub.subject_name
      FROM schedules sch
      JOIN subjects sub ON sch.subject_id = sub.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (conditions) {
      if (conditions.year_level) {
        sql += ' AND sch.year_level = ?';
        params.push(conditions.year_level);
      }
      if (conditions.semester) {
        sql += ' AND sch.semester = ?';
        params.push(conditions.semester);
      }
      if (conditions.academic_year) {
        sql += ' AND sch.academic_year = ?';
        params.push(conditions.academic_year);
      }
      if (conditions.day_of_week) {
        sql += ' AND sch.day_of_week = ?';
        params.push(conditions.day_of_week);
      }
      if (conditions.is_active !== undefined) {
        sql += ' AND sch.is_active = ?';
        params.push(conditions.is_active);
      }
    }

    sql += ' ORDER BY FIELD(sch.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), sch.start_time';

    return this.query<ScheduleFull>(sql, params);
  }
}
