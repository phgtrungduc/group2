import { Request, Response, NextFunction } from 'express';
import { ScheduleRepository } from '../repositories/schedule.repository';

export class ScheduleController {
  private scheduleRepo: ScheduleRepository;

  constructor() {
    this.scheduleRepo = new ScheduleRepository();
  }

  // GET /api/schedules/year-level/:yearLevel - Lấy lịch học theo năm
  async getScheduleByYearLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { yearLevel } = req.params;
      const { semester, academic_year } = req.query;
      
      const schedules = await this.scheduleRepo.findByYearLevelFull(
        Number(yearLevel),
        semester ? Number(semester) : undefined,
        academic_year as string
      );
      
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/schedules - Lấy tất cả lịch học (cho admin/teacher)
  async getAllSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const { year_level, semester, academic_year, day_of_week } = req.query;
      
      const conditions: any = {};
      if (year_level) conditions.year_level = Number(year_level);
      if (semester) conditions.semester = Number(semester);
      if (academic_year) conditions.academic_year = academic_year;
      if (day_of_week) conditions.day_of_week = day_of_week;
      
      const schedules = await this.scheduleRepo.findAllFull(conditions);
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      next(error);
    }
  }
}
