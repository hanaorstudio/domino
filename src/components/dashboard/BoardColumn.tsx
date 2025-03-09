
import React from 'react';
import { cn } from '@/lib/utils';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  company: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  label?: string;
}

interface BoardColumnProps {
  title: string;
  tasks: Task[];
  count: number;
  color?: string;
  columnId: string;
  onAddTask?: () => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  tasks,
  count,
  color = "bg-domino-mint",
  columnId,
  onAddTask,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col h-full min-w-[280px] sm:max-w-[280px] w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-sm", color)}></div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <span className="text-sm px-2 py-0.5 bg-background rounded-full text-muted-foreground">
            {count}
          </span>
        </div>
        <button 
          className="p-1 rounded-md hover:bg-accent transition-colors"
          onClick={onAddTask}
        >
          <Plus size={18} className="text-muted-foreground" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-4 pr-2 space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-md">
            No applications yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
