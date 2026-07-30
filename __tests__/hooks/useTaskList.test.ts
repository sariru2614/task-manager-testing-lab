import { renderHook, act } from '@testing-library/react-native';
import { useTaskList } from '../../src/hooks/useTaskList';

describe('useTaskList', () => {
  it('inicia con una lista vacía por defecto', async () => {
    const { result } = await renderHook(() => useTaskList());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.taskCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('agrega una tarea correctamente', async () => {
    const { result } = await renderHook(() => useTaskList());
    await act(() => {
      result.current.addTask('Nueva tarea');
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Nueva tarea');
    expect(result.current.tasks[0].status).toBe('pending');
    expect(result.current.error).toBeNull();
  });

  it('establece un error cuando el título está vacío', async () => {
    const { result } = await renderHook(() => useTaskList());
    await act(() => {
      result.current.addTask('');
    });
    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.error).toBe('El título no puede estar vacío');
  });

  it('limpia el error al agregar una tarea válida después de un error', async () => {
    const { result } = await renderHook(() => useTaskList());
    await act(() => {
      result.current.addTask('');
    });
    expect(result.current.error).not.toBeNull();

    await act(() => {
      result.current.addTask('Tarea válida');
    });
    expect(result.current.error).toBeNull();
    expect(result.current.tasks).toHaveLength(1);
  });

  it('elimina una tarea por su id', async () => {
    const initialTasks = [
      { id: '1', title: 'Tarea 1', status: 'pending' as const },
      { id: '2', title: 'Tarea 2', status: 'completed' as const },
    ];
    const { result } = await renderHook(() => useTaskList(initialTasks));
    await act(() => {
      result.current.removeTask('1');
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('2');
  });

  /// Pruebas Nuevas de acuerdo a las sugerencias del segundo Punto

  it('elimina los espacios externos antes de guardar una tarea', async () => {
    // Se utiliza un título con espacios al inicio y al final para comprobar
    // que el hook almacene únicamente el contenido útil ingresado por el usuario.
    const { result } = await renderHook(() => useTaskList());

    await act(() => {
      result.current.addTask('  Preparar informe  ');
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Preparar informe');
    expect(result.current.taskCount).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('mantiene la lista cuando se intenta eliminar un id inexistente', async () => {
    // Se valida que un identificador inexistente no elimine ni modifique
    // las tareas que ya se encuentran almacenadas.
    const initialTasks = [
      { id: '1', title: 'Preparar informe', status: 'pending' as const },
      { id: '2', title: 'Revisar resultados', status: 'completed' as const },
    ];

    const { result } = await renderHook(() => useTaskList(initialTasks));

    await act(() => {
      result.current.removeTask('99');
    });

    expect(result.current.tasks).toEqual(initialTasks);
    expect(result.current.taskCount).toBe(2);
  });

});