import { supabase } from "@/integrations/supabase/client";

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
    // Query the admin_user table to check credentials
    const { data: adminUser, error: queryError } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .maybeSingle();

    if (queryError) {
      console.error('Database query error:', queryError);
      throw new Error('Authentication failed');
    }

    if (!adminUser) {
      throw new Error('Invalid credentials');
    }

    // Create a session using Supabase auth
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Supabase auth error:', signInError);
      throw new Error('Authentication failed');
    }

    if (!authData.session) {
      throw new Error('Failed to create session');
    }

    return {
      token: authData.session.access_token,
      user: {
        id: adminUser.id,
        email: adminUser.email
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error instanceof Error ? error : new Error('Authentication failed');
  }
};