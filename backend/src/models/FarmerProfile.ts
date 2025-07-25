import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface FarmerProfileData {
  id?: number;
  user_id: number;
  name?: string;
  phone?: string;
  location?: string;
  farm_info?: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserWithProfile extends RowDataPacket {
  id: number;
  account: string;
  created_at: Date;
  updated_at: Date;
  status: number;
  roles: 'farmer' | 'buyer' | 'admin';
  profile_id?: number;
  name?: string;
  phone?: string;
  location?: string;
  farm_info?: string;
  avatar_url?: string;
  profile_created_at?: Date;
  profile_updated_at?: Date;
}

class FarmerProfileModel {
  // 获取用户信息和农户档案（JOIN查询）
  static async getUserWithProfile(userId: number): Promise<UserWithProfile | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute<UserWithProfile[]>(
        `SELECT 
          u.id, u.account, u.created_at, u.updated_at, u.status, u.roles,
          fp.id as profile_id, fp.name, fp.phone, fp.location, fp.farm_info, fp.avatar_url,
          fp.created_at as profile_created_at, fp.updated_at as profile_updated_at
        FROM users u
        LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
        WHERE u.id = ?`,
        [userId]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }

  // 创建农户档案
  static async createProfile(profileData: FarmerProfileData): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO farmer_profiles (user_id, name, phone, location, farm_info, avatar_url) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          profileData.user_id,
          profileData.name || null,
          profileData.phone || null,
          profileData.location || null,
          profileData.farm_info || null,
          profileData.avatar_url || null
        ]
      );
      
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  // 更新农户档案
  static async updateProfile(userId: number, profileData: Partial<FarmerProfileData>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      // 构建动态更新查询
      const updateFields: string[] = [];
      const values: any[] = [];
      
      if (profileData.name !== undefined) {
        updateFields.push('name = ?');
        values.push(profileData.name);
      }
      if (profileData.phone !== undefined) {
        updateFields.push('phone = ?');
        values.push(profileData.phone);
      }
      if (profileData.location !== undefined) {
        updateFields.push('location = ?');
        values.push(profileData.location);
      }
      if (profileData.farm_info !== undefined) {
        updateFields.push('farm_info = ?');
        values.push(profileData.farm_info);
      }
      if (profileData.avatar_url !== undefined) {
        updateFields.push('avatar_url = ?');
        values.push(profileData.avatar_url);
      }
      
      if (updateFields.length === 0) {
        return false;
      }
      
      values.push(userId);
      
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE farmer_profiles SET ${updateFields.join(', ')} WHERE user_id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // 检查农户档案是否存在
  static async profileExists(userId: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM farmer_profiles WHERE user_id = ?',
        [userId]
      );
      
      return rows.length > 0;
    } finally {
      connection.release();
    }
  }

  // 更新头像URL
  static async updateAvatar(userId: number, avatarUrl: string): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        'UPDATE farmer_profiles SET avatar_url = ? WHERE user_id = ?',
        [avatarUrl, userId]
      );
      
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

export default FarmerProfileModel;