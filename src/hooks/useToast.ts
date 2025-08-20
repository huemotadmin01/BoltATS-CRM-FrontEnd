import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (title: string, description?: string, action?: Toast['action']) =>
      addToast({ type: 'success', title, description, action }),
    error: (title: string, description?: string, action?: Toast['action']) =>
      addToast({ type: 'error', title, description, action }),
    warning: (title: string, description?: string, action?: Toast['action']) =>
      addToast({ type: 'warning', title, description, action }),
    info: (title: string, description?: string, action?: Toast['action']) =>
      addToast({ type: 'info', title, description, action }),
  };

  return { toasts, toast, removeToast };
};