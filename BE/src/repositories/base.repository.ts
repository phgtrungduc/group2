import { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database';

export interface IBaseRepository<T> {
  findAll(filters?: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected tableName: string;
  protected pool: Pool;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.pool = pool;
  }

  /**
   * Build WHERE clause from filters
   */
  protected buildWhereClause(filters?: any): { clause: string; values: any[] } {
    if (!filters || Object.keys(filters).length === 0) {
      return { clause: '', values: [] };
    }

    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      conditions.push(`${key} = ?`);
      values.push(value);
    });

    return {
      clause: ` WHERE ${conditions.join(' AND ')}`,
      values,
    };
  }

  /**
   * Build SET clause for UPDATE
   */
  protected buildSetClause(data: any): { clause: string; values: any[] } {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    return {
      clause: fields.join(', '),
      values,
    };
  }

  /**
   * Find all records
   */
  async findAll(filters?: any): Promise<T[]> {
    const { clause, values } = this.buildWhereClause(filters);
    const sql = `SELECT * FROM ${this.tableName}${clause}`;
    const [rows] = await this.pool.execute<RowDataPacket[]>(sql, values);
    return rows as T[];
  }

  /**
   * Find one record by ID
   */
  async findById(id: string): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [rows] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return rows.length > 0 ? (rows[0] as T) : null;
  }

  /**
   * Create new record
   */
  async create(data: any): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');

    const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await this.pool.execute<ResultSetHeader>(sql, values);

    // Return created record
    return await this.findById(data.id) as T;
  }

  /**
   * Update record by ID
   */
  async update(id: string, data: any): Promise<T | null> {
    const { clause, values } = this.buildSetClause(data);
    
    if (!clause) {
      return this.findById(id);
    }

    const sql = `UPDATE ${this.tableName} SET ${clause} WHERE id = ?`;
    await this.pool.execute(sql, [...values, id]);

    return this.findById(id);
  }

  /**
   * Delete record by ID
   */
  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [result] = await this.pool.execute<ResultSetHeader>(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Execute custom query
   */
  protected async query<R = any>(sql: string, params?: any[]): Promise<R[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(sql, params);
    return rows as R[];
  }

  /**
   * Execute custom query and return first row
   */
  protected async queryOne<R = any>(sql: string, params?: any[]): Promise<R | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(sql, params);
    return rows.length > 0 ? (rows[0] as R) : null;
  }

  /**
   * Get database connection for transactions
   */
  protected async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }
}
