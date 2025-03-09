
import React, { useEffect, useState } from 'react';
import BoardColumn from './BoardColumn';
import type { Task } from './BoardColumn';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import NewApplicationForm from './NewApplicationForm';

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
  const [selectedColumn, setSelectedColumn] = useState('');

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
        // Transform job applications into our column structure
        const applicationsByStatus = data.reduce((acc: Record<string, Task[]>, job: JobApplication) => {
          const status = job.status.toLowerCase();
          if (!acc[status]) {
            acc[status] = [];
          }
          
          // Calculate priority based on applied_date (just an example)
          const appliedDate = new Date(job.applied_date);
          const daysSinceApplied = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let priority: 'low' | 'medium' | 'high' = 'medium';
          if (daysSinceApplied < 7) {
            priority = 'high';
          } else if (daysSinceApplied > 21) {
            priority = 'low';
          }
          
          acc[status].push({
            id: job.id,
            title: job.position,
            company: job.company,
            deadline: appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            priority,
            label: job.notes?.includes('Remote') ? 'Remote' : 
                   job.notes?.includes('Hybrid') ? 'Hybrid' : 
                   job.notes?.includes('On-site') ? 'On-site' : undefined
          });
          
          return acc;
        }, {});
        
        // Create columns
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

  useEffect(() => {
    fetchJobApplications();
  }, [user]);

  // Function to handle adding a new job application
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
          <div className="flex gap-6 h-full pb-4">
            {columns.map(column => (
              <BoardColumn
                key={column.id}
                title={column.title}
                tasks={column.tasks}
                count={column.tasks.length}
                color={column.color}
                onAddTask={() => handleAddTask(column.id)}
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
