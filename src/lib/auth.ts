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

// Simulated authentication for demo purposes
// In production, this should call a backend API endpoint
export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { email, password } = credentials;
  
  // Simulating a network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check against hardcoded credentials
  // In production, this would be an API call to your backend
  if (email === 'admin@waterbill.com' && password === 'admin123') {
    return {
      token: 'demo-token-' + Date.now(),
      user: {
        id: 1,
        email: email
      }
    };
  }
  
  throw new Error('Invalid credentials');
};