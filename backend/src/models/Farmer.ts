import { pool } from '../config/database';

export interface Farmer {
  id?: number;
  account: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  status?: number;
}

export class FarmerModel {
  static async findByAccount(account: string): Promise<Farmer | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE account = ?',
        [account]
      );
      const farmers = rows as Farmer[];
      return farmers.length > 0 ? farmers[0] : null;
    } catch (error) {
      throw new Error(`Failed to find farmer: ${error}`);
    }
  }

  static async create(farmer: Omit<Farmer, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (account, password, status) VALUES (?, ?, ?)',
        [farmer.account, farmer.password, farmer.status || 1]
      );
      return (result as any).insertId;
    } catch (error) {
      throw new Error(`Failed to create farmer: ${error}`);
    }
  }

  static async validatePassword(plainPassword: string, storedPassword: string): Promise<boolean> {
    return plainPassword === storedPassword;
  }

  static async findById(id: number): Promise<Farmer | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ? AND status = 1',
        [id]
      );
      const farmers = rows as Farmer[];
      return farmers.length > 0 ? farmers[0] : null;
    } catch (error) {
      throw new Error(`Failed to find farmer by id: ${error}`);
    }
  }

  static async updateStatus(id: number, status: number): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to update farmer status: ${error}`);
    }
  }

  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPassword, id]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to update farmer password: ${error}`);
    }
  }
}