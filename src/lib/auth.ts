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
    const { data: adminUser, error } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .single();

    if (error || !adminUser) {
      throw new Error('Invalid credentials');
    }

    // Create a session using Supabase auth
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      throw signInError;
    }

    return {
      token: session?.access_token || '',
      user: {
        id: adminUser.id,
        email: adminUser.email
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Invalid credentials');
  }
};