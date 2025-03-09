
import { supabase } from '@/integrations/supabase/client';

export type TaskStatus = 'applied' | 'interview' | 'offer' | 'rejected';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  notes?: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export async function getJobApplications() {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .order('applied_date', { ascending: false });

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }

  return data;
}

export async function addJobApplication(jobApplication: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('job_applications')
    .insert(jobApplication)
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
