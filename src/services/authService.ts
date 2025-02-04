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
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) throw signInError;

      if (!authData.session) {
        throw new Error('Failed to create session');
      }

      const { data: adminUser, error: queryError } = await supabase
        .from('admin_user')
        .select('*')
        .eq('email', credentials.email)
        .maybeSingle();

      if (queryError) throw queryError;
      if (!adminUser) throw new Error('Invalid credentials');

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