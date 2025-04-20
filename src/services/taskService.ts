
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type TaskStatus = 'applied' | 'interview' | 'offer' | 'rejected';
export type TaskPriority = 'low' | 'medium' | 'high';

export type JobApplication = Database['public']['Tables']['job_applications']['Row'];

export async function getJobApplications() {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .order('applied_date', { ascending: false });

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }

  return data as JobApplication[];
}

export async function addJobApplication(
  jobApplication: Omit<Database['public']['Tables']['job_applications']['Insert'], 'id' | 'created_at' | 'updated_at'>
) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      ...jobApplication,
      user_id: user.user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding job application:', error);
    throw error;
  }

  return data;
}

export async function updateJobApplication(id: string, updates: Partial<JobApplication>) {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating job application:', error);
    throw error;
  }

  return data;
}

export async function deleteJobApplication(id: string) {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting job application:', error);
    throw error;
  }

  return true;
}
