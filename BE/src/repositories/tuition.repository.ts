import { BaseRepository } from './base.repository';
import { Tuition, TuitionWithComputed } from '../models';

export class TuitionRepository extends BaseRepository<Tuition> {
  constructor() {
    super('tuition');
  }

  // Add computed fields to tuition data
  private addComputedFields(tuition: Tuition): TuitionWithComputed {
    const total = tuition.amount * tuition.months;
    const remaining = total - tuition.paid;
    let status: 'pending' | 'partial' | 'completed';
    
    if (tuition.paid === 0) {
      status = 'pending';
    } else if (tuition.paid >= total) {
      status = 'completed';
    } else {
      status = 'partial';
    }

    return {
      ...tuition,
      total,
      remaining,
      status
    };
  }

  // Get tuition by student with computed fields
  async findByStudent(studentId: string): Promise<TuitionWithComputed[]> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute<any[]>(
        `SELECT * FROM tuition WHERE student_id = ? ORDER BY year ASC`,
        [studentId]
      );
      connection.release();
      
      return rows.map(row => this.addComputedFields(row));
    } catch (error) {
      connection.release();
      throw error;
    }
  }
}
