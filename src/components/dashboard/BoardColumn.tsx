
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
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  tasks,
  count,
  color = "bg-domino-mint"
}) => {
  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[280px] animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-sm", color)}></div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <span className="text-sm px-2 py-0.5 bg-background rounded-full text-muted-foreground">
            {count}
          </span>
        </div>
        <button className="p-1 rounded-md hover:bg-accent transition-colors">
          <Plus size={18} className="text-muted-foreground" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-4 pr-2 space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn;
