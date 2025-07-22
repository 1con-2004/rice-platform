import { pool } from '../config/database';

beforeAll(async () => {
  await pool.execute('DELETE FROM users');
});

afterAll(async () => {
  await pool.execute('DELETE FROM users');
});

beforeEach(async () => {
  await pool.execute('DELETE FROM users');
});