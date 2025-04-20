
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export type JobApplication = Database['public']['Tables']['job_applications']['Row'];

export function useJobApplications() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchJobApplications = async () => {
    if (!user) return [];
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('applied_date', { ascending: false });
        
      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      toast.error('Failed to load job applications: ' + error.message);
      console.error('Error loading job applications:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus } as Partial<JobApplication>)
        .eq('id', taskId as string);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Application moved to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    } catch (error: any) {
      toast.error('Failed to update application status: ' + error.message);
      console.error('Error updating application status:', error);
    }
  };

  const handleDeleteApplication = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', taskId);

      if (error) {
        throw error;
      }
      toast.success('Application deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete application: ' + error.message);
      console.error('Error deleting application:', error);
    }
  };

  return {
    loading,
    fetchJobApplications,
    handleStatusChange,
    handleDeleteApplication
  };
}
