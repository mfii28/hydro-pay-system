import pool from './db';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { email, password } = credentials;
  
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    // For demo purposes we're using a simple token
    // In production, you should use proper JWT signing
    const token = 'demo-token-' + Date.now();

    return {
      token,
      user: {
        id: rows[0].id,
        email: rows[0].email
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Invalid credentials');
  }
};