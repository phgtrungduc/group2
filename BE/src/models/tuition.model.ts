// Tuition Entity (simplified schema - 4 base fields)
export interface Tuition {
  id: string;
  student_id: string;
  year: number; // 1, 2, 3 (năm học)
  amount: number; // Học phí/tháng
  months: number; // Số tháng (default 12)
  paid: number; // Số tiền đã đóng
  is_active: boolean; // Năm hiện tại đang học
  created_at?: Date;
  updated_at?: Date;
}

// Tuition with computed fields for API response
export interface TuitionWithComputed extends Tuition {
  total: number; // amount * months
  remaining: number; // total - paid
  status: 'pending' | 'partial' | 'completed'; // computed from paid
}

// Tuition with student data
export interface TuitionFull extends TuitionWithComputed {
  student_name: string;
  student_code: string;
}

// Create Tuition DTO
export interface CreateTuitionDto {
  student_id: string;
  year: number;
  amount: number;
  months?: number; // default 12
}

// Update Tuition DTO
export interface UpdateTuitionDto {
  paid?: number;
  is_active?: boolean;
}

// Tuition Payment Entity
export interface TuitionPayment {
  id: string;
  tuition_id: string;
  payment_amount: number;
  payment_date: Date;
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'other';
  transaction_id?: string;
  remarks?: string;
  created_by?: string;
  created_at?: Date;
}

// Create Payment DTO
export interface CreatePaymentDto {
  tuition_id: string;
  payment_amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'other';
  transaction_id?: string;
  remarks?: string;
  created_by?: string;
}
