import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';
import { createTask, fetchTasks } from '../services/taskService';

const STORAGE_KEY = 'tasks';

export function useCreateTask(useApi = false) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(useApi);
  const loaded = useRef(false);

  useEffect(() => {
    // En integración las tareas vienen de la API; el flujo normal sigue usando AsyncStorage.
    if (useApi) {
      setLoading(true);
      setError(null);

      fetchTasks()
        .then((data) => {
          setTasks(data);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : 'Error al obtener las tareas'
          );
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setTasks(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
      });
  }, [useApi]);

  useEffect(() => {
    if (useApi) return;

    // Esperamos la lectura inicial para no guardar [] encima de las tareas existentes.
    if (!loaded.current) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks, useApi]);

  const submit = async (title: string) => {
    setError(null);

    if (useApi) {
      try {
        const task = await createTask(title);
        setTasks((prev) => [...prev, task]);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(
          err instanceof Error ? err.message : 'Error al crear la tarea'
        );
      }

      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: title,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, task]);
    setStatus('success');
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'completed' ? 'pending' : 'completed',
            }
          : t
      )
    );
  };

  return {
    status,
    tasks,
    error,
    loading,
    submit,
    removeTask,
    toggleTask,
  };
}