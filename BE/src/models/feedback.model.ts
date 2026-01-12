// Feedback Entity
export interface Feedback {
  id: string;
  student_id: string;
  teacher_id?: string;
  subject_id?: string;
  message: string;
  reply?: string;
  status: 'pending' | 'replied' | 'resolved' | 'closed';
  created_at?: Date;
  replied_at?: Date;
  updated_at?: Date;
}

// Feedback with related data
export interface FeedbackFull extends Feedback {
  student_name: string;
  student_code: string;
  teacher_name?: string;
  subject_name?: string;
}

// Create Feedback DTO
export interface CreateFeedbackDto {
  student_id: string;
  teacher_id?: string;
  subject_id?: string;
  message: string;
}

// Update Feedback DTO (reply)
export interface UpdateFeedbackDto {
  reply?: string;
  status?: 'pending' | 'replied' | 'resolved' | 'closed';
}

// Schedule Entity
export interface Schedule {
  id: string;
  subject_id: string;
  teacher_id: string;
  year_level: number;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  room?: string;
  semester: number;
  academic_year: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Schedule with related data
export interface ScheduleFull extends Schedule {
  subject_name: string;
  subject_code: string;
  teacher_name: string;
}

// Create Schedule DTO
export interface CreateScheduleDto {
  subject_id: string;
  teacher_id: string;
  year_level: number;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  room?: string;
  semester: number;
  academic_year: string;
}

// Update Schedule DTO
export interface UpdateScheduleDto {
  day_of_week?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time?: string;
  end_time?: string;
  room?: string;
  is_active?: boolean;
}
