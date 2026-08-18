import { CreateTaskResponseSchema } from '../../src/schemas/createTaskContractSchema';

describe('Contrato API - POST /tasks', () => {
  it('acepta una respuesta válida al crear una tarea', () => {
    const response = {
      id: '10',
      title: 'Comprar mercado',
      status: 'pending',
    };

    const result = CreateTaskResponseSchema.safeParse(response);

    expect(result.success).toBe(true);
  });

  it('rechaza una respuesta con una estructura diferente al contrato', () => {
    const response = {
      id: 10,
      title: 'Comprar mercado',
      state: 'pending',
    };

    const result = CreateTaskResponseSchema.safeParse(response);

    expect(result.success).toBe(false);
  });
});