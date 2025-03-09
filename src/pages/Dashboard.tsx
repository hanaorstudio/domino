
import React from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import TaskBoard from '../components/dashboard/TaskBoard';
import Stats from '../components/dashboard/Stats';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full ml-0 md:ml-20">
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <NavBar />
          <Stats />
          <TaskBoard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
