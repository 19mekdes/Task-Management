// src/components/EmptyState.tsx
import React from 'react';
import type { FilterType } from '../types/task.types';

interface EmptyStateProps {
  filter: FilterType;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  const messages = {
    all: "You don't have any tasks yet. Create your first task above!",
    pending: "No pending tasks. Great job! 🎉",
    completed: "No completed tasks yet. Get started with your first task!"
  };

  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500">
        {messages[filter]}
      </p>
    </div>
  );
};

export default EmptyState;