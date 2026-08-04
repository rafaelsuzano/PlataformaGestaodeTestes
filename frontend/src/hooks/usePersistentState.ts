import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to sessionStorage', e);
    }
  }, [key, state]);

  return [state, setState];
}
