
import React from 'react';
import BoardColumn from './BoardColumn';
import { Task } from './BoardColumn';

interface BoardProps {
  columns: {
    id: string;
    title: string;
    color: string;
    tasks: Task[];
  }[];
  onAddTask: (columnId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const Board: React.FC<BoardProps> = ({
  columns,
  onAddTask,
  onStatusChange,
  onDeleteTask,
}) => {
  return (
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
            onAddTask={() => onAddTask(column.id)}
            onStatusChange={onStatusChange}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
