
import React from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import TaskBoard from '../components/dashboard/TaskBoard';
import Stats from '../components/dashboard/Stats';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <NavBar />
          <Stats />
          <TaskBoard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
