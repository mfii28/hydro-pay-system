// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oabmmrxoogccnuyppfmu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYm1tcnhvb2djY251eXBwZm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMjI0NjMsImV4cCI6MjA1Mzg5ODQ2M30.G1hyI7CPwhd_q0vAXbyfODPvjGiyv587_3nemXFkLI0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);