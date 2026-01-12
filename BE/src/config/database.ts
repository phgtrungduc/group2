import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Connection Pool Configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
export const pool = mysql.createPool(poolConfig);

// Test database connection
export const connectDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    console.log(`📊 Database: ${poolConfig.database}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Close database connection pool
export const disconnectDatabase = async () => {
  try {
    await pool.end();
    console.log('👋 Database connection pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

// Execute query helper
export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
};

// Execute query and return first row
export const queryOne = async <T = any>(sql: string, params?: any[]): Promise<T | null> => {
  const [rows] = await pool.execute(sql, params);
  const result = rows as T[];
  return result.length > 0 ? result[0] : null;
};

// Begin transaction
export const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

export default pool;
