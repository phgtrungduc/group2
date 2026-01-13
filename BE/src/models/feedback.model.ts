// Feedback Entity
export interface Feedback {
  id: string;
  student_id: string;
  teacher_id: string; // Required - giáo viên được đánh giá
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
  teacher_name: string;
  teacher_code: string;
}

// Create Feedback DTO
export interface CreateFeedbackDto {
  student_id: string;
  teacher_id: string;
  message: string;
}

// Update Feedback DTO (reply)
export interface UpdateFeedbackDto {
  reply?: string;
  status?: 'pending' | 'replied' | 'resolved' | 'closed';
}
