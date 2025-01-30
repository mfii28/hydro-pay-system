import jwt from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = 'your-secret-key'; // In production, this should be an environment variable

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authenticateUser = async (credentials: LoginCredentials) => {
  const { email, password } = credentials;
  
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM admins WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token, user: { id: rows[0].id, email: rows[0].email } };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};