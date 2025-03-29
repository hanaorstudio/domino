
import { supabase } from "@/integrations/supabase/client";

// Function to fetch user's job applications to analyze trends
export const fetchUserJobApplications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('company, position, status')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
};
