
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Task } from './BoardColumn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onDelete?: (taskId: string) => void;
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

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete }) => {
  const { id, title, company, deadline, priority, label } = task;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleStatusChange = async (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };
  
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (onDelete) {
      onDelete(id);
    }
    setShowDeleteConfirm(false);
  };
  
  return (
    <>
      <div className="domino-card p-4 animate-slide-in-right">
        <div className="flex justify-between mb-2">
          <div>
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{company}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-accent rounded-md">
                <MoreHorizontal size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleStatusChange('applied')}>
                Move to Applied
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('interview')}>
                Move to Interview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('offer')}>
                Move to Offer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
                Move to Rejected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Application
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="domino-divider"></div>
        
        <div className="flex items-center justify-between mt-2">
          {deadline && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar size={12} className="mr-1" />
              {deadline}
            </div>
          )}
          
          <div className="flex items-center gap-1 flex-wrap">
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
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job application for {title} at {company}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskCard;
