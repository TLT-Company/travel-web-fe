'use client';

import { useState } from 'react';
import TaskList from './TaskList';
import TaskAssignment from './TaskAssignment';

const TaskManagement = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'assignment'>('list');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý công việc
        </h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Danh sách công việc
          </button>
          <button
            onClick={() => setActiveTab('assignment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assignment'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Giao việc nhân viên
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'list' && <TaskList />}
        {activeTab === 'assignment' && <TaskAssignment />}
      </div>
    </div>
  );
};

export default TaskManagement; 