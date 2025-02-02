import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "https://oabmmrxoogccnuyppfmu.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYm1tcnhvb2djY251eXBwZm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMjI0NjMsImV4cCI6MjA1Mzg5ODQ2M30.G1hyI7CPwhd_q0vAXbyfODPvjGiyv587_3nemXFkLI0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);