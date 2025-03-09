
import React from 'react';
import BoardColumn from './BoardColumn';
import type { Task } from './BoardColumn';

const TaskBoard: React.FC = () => {
  // Sample data
  const columns = [
    { 
      id: 'applied', 
      title: 'Applied', 
      color: 'bg-domino-green',
      tasks: [
        {
          id: '1',
          title: 'Frontend Developer',
          company: 'TechCorp',
          deadline: 'June 15',
          priority: 'high' as const,
          label: 'Remote'
        },
        {
          id: '2',
          title: 'UX Designer',
          company: 'DesignHub',
          deadline: 'June 20',
          priority: 'medium' as const,
          label: 'Hybrid'
        },
        {
          id: '3',
          title: 'Product Manager',
          company: 'Innovate Inc',
          deadline: 'June 25',
          priority: 'low' as const,
          label: 'On-site'
        }
      ]
    },
    { 
      id: 'interview', 
      title: 'Interview', 
      color: 'bg-domino-mint',
      tasks: [
        {
          id: '4',
          title: 'React Developer',
          company: 'WebSolutions',
          deadline: 'June 18',
          priority: 'high' as const,
          label: 'Remote'
        },
        {
          id: '5',
          title: 'Full Stack Engineer',
          company: 'CodeMasters',
          deadline: 'June 22',
          priority: 'medium' as const,
          label: 'Full-time'
        }
      ]
    },
    { 
      id: 'offer', 
      title: 'Offer', 
      color: 'bg-domino-pink',
      tasks: [
        {
          id: '6',
          title: 'UI Developer',
          company: 'PixelPerfect',
          deadline: 'June 30',
          priority: 'medium' as const,
          label: 'Hybrid'
        }
      ]
    },
    { 
      id: 'rejected', 
      title: 'Rejected', 
      color: 'bg-domino-rose',
      tasks: [
        {
          id: '7',
          title: 'DevOps Engineer',
          company: 'CloudSys',
          deadline: 'June 10',
          priority: 'low' as const,
          label: 'On-site'
        },
        {
          id: '8',
          title: 'Data Analyst',
          company: 'DataDriven',
          deadline: 'June 12',
          priority: 'medium' as const,
          label: 'Part-time'
        }
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Job Applications</h2>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full pb-4">
          {columns.map(column => (
            <BoardColumn
              key={column.id}
              title={column.title}
              tasks={column.tasks}
              count={column.tasks.length}
              color={column.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
