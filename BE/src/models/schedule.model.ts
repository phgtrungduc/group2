// Schedule Entity
export interface Schedule {
  id: string;
  subject_id: string;
  year_level: number; // 1, 2, 3
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; // TIME format "HH:MM:SS"
  end_time: string;
  room?: string;
  semester: number; // 1 or 2
  academic_year: string; // e.g., "2024-2025"
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Schedule with Subject info (JOIN result)
export interface ScheduleFull extends Schedule {
  subject_code: string;
  subject_name: string;
}

// Create Schedule DTO
export interface CreateScheduleDto {
  subject_id: string;
  year_level: number;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  room?: string;
  semester: number;
  academic_year: string;
  is_active?: boolean;
}

// Update Schedule DTO
export interface UpdateScheduleDto {
  subject_id?: string;
  year_level?: number;
  day_of_week?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time?: string;
  end_time?: string;
  room?: string;
  semester?: number;
  academic_year?: string;
  is_active?: boolean;
}
