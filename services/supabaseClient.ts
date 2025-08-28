import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvhqiehzkosbwejucced.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aHFpZWh6a29zYndlanVjY2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Njc0NzksImV4cCI6MjA2ODU0MzQ3OX0.sRtji_WzmVjcOclwOBvzLBHJhY6yeWEKO64EFuqIyb4';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
