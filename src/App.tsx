import { v4 as uuidv4 } from 'uuid';
import { useMemo, useState, useCallback } from 'react';
import type { Task, FilterType, TaskFormData } from './types/task.types';
import { useLocalStorage } from './hooks/useLocalStorage';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import FilterTabs from './components/FilterTabs';
import EmptyState from './components/EmptyState';

function App() {
  // State
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on current filter - memoized
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Calculate task counts - memoized
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  // FR-1 & FR-2: Create new task - using useCallback
  const handleAddTask = useCallback((data: TaskFormData) => {
    const newTask: Task = {
      id: uuidv4(),
      title: data.title.trim(),
      description: data.description.trim() || undefined,
      dueDate: data.dueDate || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [setTasks]);

  // FR-4: Edit task - using useCallback
  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  // Update task - using useCallback
  const handleUpdateTask = useCallback((data: TaskFormData) => {
    if (!editingTask) return;

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              title: data.title.trim(),
              description: data.description.trim() || undefined,
              dueDate: data.dueDate || undefined,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    setEditingTask(null);
  }, [editingTask, setTasks]);

  // FR-4: Delete task - using useCallback
  const handleDeleteTask = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      // If we're deleting the task that's being edited, cancel edit mode
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
    }
  }, [setTasks, editingTask?.id]);

  // FR-4: Toggle task status - using useCallback
  const handleToggleStatus = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, [setTasks]);

  // Cancel editing - using useCallback
  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">Organize your daily tasks efficiently</p>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Task Form - Show either add form or edit form */}
          {editingTask ? (
            <div className="relative">
              <TaskForm
                key={editingTask.id}
                onSubmit={handleUpdateTask}
                initialData={{
                  title: editingTask.title,
                  description: editingTask.description || '',
                  dueDate: editingTask.dueDate || '',
                }}
                buttonText="Update Task"
              />
              <button
                onClick={handleCancelEdit}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Cancel editing"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <TaskForm onSubmit={handleAddTask} />
          )}

          {/* Filter Tabs */}
          <FilterTabs
            currentFilter={filter}
            onFilterChange={setFilter}
            counts={taskCounts}
          />

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                />
              ))
            ) : (
              <EmptyState filter={filter} />
            )}
          </div>

          {/* Footer Stats */}
          {tasks.length > 0 && (
            <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
              <span className="font-medium">{taskCounts.pending} pending</span> • 
              <span className="font-medium"> {taskCounts.completed} completed</span> • 
              <span className="font-medium"> {taskCounts.all} total</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;