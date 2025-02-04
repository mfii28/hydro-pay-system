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
        .single();

      if (queryError) {
        toast({
          title: "Error",
          description: "Failed to verify admin user",
          variant: "destructive",
        });
        throw queryError;
      }

      if (!adminUser) {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
        throw new Error('Invalid credentials');
      }

      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        // If sign in fails, try to create the user in Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
        });

        if (signUpError) {
          toast({
            title: "Error",
            description: "Authentication failed",
            variant: "destructive",
          });
          throw signUpError;
        }

        // Try signing in again after creating the user
        const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (newSignInError) {
          toast({
            title: "Error",
            description: "Failed to sign in after account creation",
            variant: "destructive",
          });
          throw newSignInError;
        }

        return {
          token: newSignInData.session?.access_token,
          user: {
            id: adminUser.id,
            email: adminUser.email
          }
        };
      }

      return {
        token: signInData.session?.access_token,
        user: {
          id: adminUser.id,
          email: adminUser.email
        }
      };
    } catch (error) {
      console.error('Auth error:', error);
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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        });
        throw error;
      }
      toast({
        title: "Success",
        description: "Successfully signed out",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return { signIn, signOut };
};