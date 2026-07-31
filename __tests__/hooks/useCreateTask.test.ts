import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import { createTask } from '../../src/services/taskService';
import { Task } from '../../src/types';

// Se simula el servicio para controlar si la creación de la tarea
// responde correctamente o genera un error. Así se prueba el hook
// sin depender del comportamiento real del servicio.
jest.mock('../../src/services/taskService', () => ({
  createTask: jest.fn(),
}));

const mockCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe('useCreateTask', () => {
  beforeEach(() => {
    // Se limpia la configuración del mock antes de cada prueba
    // para evitar que una respuesta afecte el siguiente caso.
    mockCreateTask.mockReset();
  });

  it('elimina una tarea creada cuando recibe su identificador', async () => {
    // Primero se crea una tarea para tener información en la lista
    // y luego comprobar el funcionamiento de removeTask.
    const tareaCreada: Task = {
      id: '10',
      title: 'Preparar informe',
      status: 'pending',
    };

    mockCreateTask.mockResolvedValue(tareaCreada);

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Preparar informe');
    });

    expect(result.current.tasks).toEqual([tareaCreada]);

    await act(() => {
      result.current.removeTask('10');
    });

    expect(result.current.tasks).toEqual([]);
  });

  it('cambia el estado a error cuando no se puede crear la tarea', async () => {
    // En este caso se simula una falla del servicio para revisar
    // cómo responde el hook cuando la tarea no puede guardarse.
    mockCreateTask.mockRejectedValue(
      new Error('No fue posible crear la tarea')
    );

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Preparar informe');
    });

    expect(mockCreateTask).toHaveBeenCalledWith('Preparar informe');
    expect(result.current.status).toBe('error');
    expect(result.current.tasks).toEqual([]);
  });
});