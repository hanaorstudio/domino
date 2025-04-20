
import React, { useEffect, useState } from 'react';
import BoardColumn from './BoardColumn';
import type { Task } from './BoardColumn';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import NewApplicationForm from './NewApplicationForm';
import { deleteJobApplication } from '@/services/taskService';
import { Database } from '@/integrations/supabase/types';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  notes?: string;
  url?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const TaskBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('applied');

  const fetchJobApplications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('applied_date', { ascending: false });
        
      if (error) {
        throw error;
      }

      if (data) {
        // Type-safe approach: Explicitly cast the data and handle each application
        const applications = data as Database['public']['Tables']['job_applications']['Row'][];
        
        // Create a record to group tasks by status
        const applicationsByStatus: Record<string, Task[]> = {};
        
        // Process each application
        applications.forEach(job => {
          const status = job.status.toLowerCase();
          if (!applicationsByStatus[status]) {
            applicationsByStatus[status] = [];
          }
          
          const appliedDate = new Date(job.applied_date);
          const daysSinceApplied = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let priority: 'low' | 'medium' | 'high' = 'medium';
          if (daysSinceApplied < 7) {
            priority = 'high';
          } else if (daysSinceApplied > 21) {
            priority = 'low';
          }
          
          applicationsByStatus[status].push({
            id: job.id,
            title: job.position,
            company: job.company,
            deadline: appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            priority,
            label: job.notes?.includes('Remote') ? 'Remote' : 
                   job.notes?.includes('Hybrid') ? 'Hybrid' : 
                   job.notes?.includes('On-site') ? 'On-site' : undefined
          });
        });
        
        const newColumns = [
          {
            id: 'applied',
            title: 'Applied',
            color: 'bg-domino-green',
            tasks: applicationsByStatus['applied'] || []
          },
          {
            id: 'interview',
            title: 'Interview',
            color: 'bg-domino-mint',
            tasks: applicationsByStatus['interview'] || []
          },
          {
            id: 'offer',
            title: 'Offer',
            color: 'bg-domino-pink',
            tasks: applicationsByStatus['offer'] || []
          },
          {
            id: 'rejected',
            title: 'Rejected',
            color: 'bg-domino-rose',
            tasks: applicationsByStatus['rejected'] || []
          }
        ];
        
        setColumns(newColumns);
      }
    } catch (error: any) {
      toast.error('Failed to load job applications: ' + error.message);
      console.error('Error loading job applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', taskId);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Application moved to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
      fetchJobApplications();
    } catch (error: any) {
      toast.error('Failed to update application status: ' + error.message);
      console.error('Error updating application status:', error);
    }
  };

  const handleDeleteApplication = async (taskId: string) => {
    try {
      await deleteJobApplication(taskId);
      toast.success('Application deleted successfully');
      fetchJobApplications();
    } catch (error: any) {
      toast.error('Failed to delete application: ' + error.message);
      console.error('Error deleting application:', error);
    }
  };

  useEffect(() => {
    fetchJobApplications();
    
    const handleOpenNewTaskForm = () => {
      setSelectedColumn('applied');
      setShowNewApplicationForm(true);
    };
    
    window.addEventListener('open-new-task-form', handleOpenNewTaskForm);
    
    return () => {
      window.removeEventListener('open-new-task-form', handleOpenNewTaskForm);
    };
  }, [user]);

  const handleAddTask = (columnId: string) => {
    setSelectedColumn(columnId);
    setShowNewApplicationForm(true);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Job Applications</h2>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <div className="flex flex-col sm:flex-row gap-6 h-full pb-4">
            {columns.map(column => (
              <BoardColumn
                key={column.id}
                title={column.title}
                tasks={column.tasks}
                count={column.tasks.length}
                color={column.color}
                columnId={column.id}
                onAddTask={() => handleAddTask(column.id)}
                onStatusChange={handleStatusChange}
                onDeleteTask={handleDeleteApplication}
              />
            ))}
          </div>
        </div>
      )}

      {showNewApplicationForm && (
        <NewApplicationForm 
          status={selectedColumn} 
          onClose={() => setShowNewApplicationForm(false)}
          onSuccess={() => {
            setShowNewApplicationForm(false);
            fetchJobApplications();
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;
