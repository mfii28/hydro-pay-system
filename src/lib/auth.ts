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
  
  // For demo purposes - in production this would call your backend API
  if (email === 'admin@water.com' && password === 'admin') {
    return {
      token: 'demo-token',
      user: {
        id: 1,
        email: 'admin@water.com'
      }
    };
  }
  
  throw new Error('Invalid credentials');
};