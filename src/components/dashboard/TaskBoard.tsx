
import React, { useEffect, useState } from 'react';
import type { Task } from './BoardColumn';
import NewApplicationForm from './NewApplicationForm';
import Board from './Board';
import { useJobApplications, JobApplication } from '@/hooks/useJobApplications';

const TaskBoard: React.FC = () => {
  const [columns, setColumns] = useState<{
    id: string;
    title: string;
    color: string;
    tasks: Task[];
  }[]>([]);
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('applied');
  const { loading, fetchJobApplications, handleStatusChange, handleDeleteApplication } = useJobApplications();

  const processApplications = (applications: JobApplication[]) => {
    const applicationsByStatus: Record<string, Task[]> = {};
    
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
    
    return [
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
  };

  const refreshApplications = async () => {
    const applications = await fetchJobApplications();
    setColumns(processApplications(applications as JobApplication[]));
  };

  useEffect(() => {
    refreshApplications();
    
    const handleOpenNewTaskForm = () => {
      setSelectedColumn('applied');
      setShowNewApplicationForm(true);
    };
    
    window.addEventListener('open-new-task-form', handleOpenNewTaskForm);
    
    return () => {
      window.removeEventListener('open-new-task-form', handleOpenNewTaskForm);
    };
  }, []);

  const handleColumnStatusChange = async (taskId: string, newStatus: string) => {
    await handleStatusChange(taskId, newStatus);
    refreshApplications();
  };

  const handleColumnDeleteTask = async (taskId: string) => {
    await handleDeleteApplication(taskId);
    refreshApplications();
  };

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
        <Board 
          columns={columns}
          onAddTask={handleAddTask}
          onStatusChange={handleColumnStatusChange}
          onDeleteTask={handleColumnDeleteTask}
        />
      )}

      {showNewApplicationForm && (
        <NewApplicationForm 
          status={selectedColumn} 
          onClose={() => setShowNewApplicationForm(false)}
          onSuccess={() => {
            setShowNewApplicationForm(false);
            refreshApplications();
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;
