
import { useCallback, useState } from 'react';
import type { Task } from '../types/task.types';

export function useLocalStorage(key: string, initialValue: Task[]) {
  // Lazy initialization - this runs only once
  const [storedValue, setStoredValue] = useState<Task[]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Use useCallback for the setter
  const setValue = useCallback((value: Task[] | ((val: Task[]) => Task[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}