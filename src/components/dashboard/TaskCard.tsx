
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import type { Task } from './BoardColumn';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700"
};

const labelColors = {
  "Remote": "bg-indigo-100 text-indigo-700",
  "On-site": "bg-emerald-100 text-emerald-700",
  "Hybrid": "bg-purple-100 text-purple-700",
  "Part-time": "bg-amber-100 text-amber-700",
  "Full-time": "bg-teal-100 text-teal-700"
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { title, company, deadline, priority, label } = task;
  
  return (
    <div className="domino-card p-4 animate-slide-in-right">
      <div className="mb-2">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{company}</p>
      </div>
      
      <div className="domino-divider"></div>
      
      <div className="flex items-center justify-between mt-2">
        {deadline && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar size={12} className="mr-1" />
            {deadline}
          </div>
        )}
        
        <div className="flex items-center gap-1">
          {label && (
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              labelColors[label as keyof typeof labelColors] || "bg-gray-100 text-gray-700"
            )}>
              {label}
            </span>
          )}
          
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            priorityColors[priority]
          )}>
            {priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
