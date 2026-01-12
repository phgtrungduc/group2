// Tuition Entity
export interface Tuition {
  id: string;
  student_id: string;
  year_level: number; // 1, 2, 3
  academic_year: string; // "2024-2025"
  amount_per_month: number;
  total_months: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: 'pending' | 'partial' | 'completed';
  due_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Tuition with student data
export interface TuitionFull extends Tuition {
  student_name: string;
  student_code: string;
}

// Create Tuition DTO
export interface CreateTuitionDto {
  student_id: string;
  year_level: number;
  academic_year: string;
}

// Update Tuition DTO
export interface UpdateTuitionDto {
  due_date?: Date;
  status?: 'pending' | 'partial' | 'completed';
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
