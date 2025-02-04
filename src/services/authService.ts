import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthService = () => {
  const { toast } = useToast();

  const signIn = async (credentials: LoginCredentials) => {
    try {
      // First check if the admin user exists in our database
      const { data: adminUser, error: queryError } = await supabase
        .from('admin_user')
        .select('*')
        .eq('email', credentials.email)
        .maybeSingle();

      if (queryError) throw queryError;
      if (!adminUser) throw new Error('Invalid credentials');

      // Then attempt to sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        // If sign in fails, try to create the user in Supabase Auth
        const { error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
        });

        if (signUpError) {
          throw new Error('Authentication failed. Please try again.');
        }

        // Try signing in again after creating the user
        const { data: newAuthData, error: newSignInError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (newSignInError) throw newSignInError;
        if (!newAuthData.session) throw new Error('Failed to create session');

        return {
          token: newAuthData.session.access_token,
          user: {
            id: adminUser.id,
            email: adminUser.email
          }
        };
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
      const message = error instanceof Error ? error.message : 'Authentication failed';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { signIn, signOut };
};