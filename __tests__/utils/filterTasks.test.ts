import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { Task } from '../../src/types';

const mockTasks: Task[] = [
  { id: '1', title: 'Comprar leche', status: 'pending' },
  { id: '2', title: 'Estudiar React Native', status: 'completed' },
  { id: '3', title: 'Hacer ejercicio', status: 'pending' },
  { id: '4', title: 'Leer documentación de Jest', status: 'completed' },
];

describe('filterTasksByStatus', () => {
  it('devuelve solo las tareas con el estado indicado', () => {
    const result = filterTasksByStatus(mockTasks, 'completed');
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Estudiar React Native');
  });

  it('devuelve un arreglo vacío cuando no hay coincidencias', () => {
    const result = filterTasksByStatus(mockTasks, 'archived');
    expect(result).toEqual([]);
  });

  it('devuelve todas las tareas cuando el estado es "all"', () => {
    const result = filterTasksByStatus(mockTasks, 'all');
    expect(result).toHaveLength(4);
  });

  it('aplica el filtro sin modificar la lista original', () => {
  // Se guarda una copia para comprobar que el filtro no altere
  // la colección que recibió como entrada.
  const estadoInicial = mockTasks.map((task) => ({ ...task }));
  const resultado = filterTasksByStatus(mockTasks, 'pending');

  expect(mockTasks).toEqual(estadoInicial);
  expect(resultado).not.toBe(mockTasks);
});


  it('lanza un error cuando el estado es inválido', () => {
    // @ts-expect-error probando entrada inválida en runtime
    expect(() => filterTasksByStatus(mockTasks, 'invalido')).toThrow();
  });

  /// Pruebas Nuevas de acuerdo a las sugerencias del primer punto

  it('devuelve unicamente las tareas pendientes', () => {
  
  // Definiciones
  // Se utiliza una lista con distintos estados para comprobar que el filtro
  // no incluya tareas completadas u otras que no correspondan al criterio.
  const estado = 'pending';
  const result = filterTasksByStatus(mockTasks, estado);
  const titulos = result.map((task) => task.title);

  // Se valida la cantidad y también el contenido para evitar que la prueba
  // pase únicamente porque retornó dos elementos incorrectos.
  
  expect(result).toHaveLength(2);
  expect(titulos).toContain('Comprar leche');
  expect(titulos).toContain('Hacer ejercicio');

  });

  it('devuelve un arreglo vacio cuando recibe una lista sin tareas', () => {
  // Defincioces
  // Este caso límite permite confirmar que la función maneja una colección
  // vacía sin generar errores ni retornar información inesperada.
  const tareasVacias: Task[] = [];
  const result = filterTasksByStatus(tareasVacias, 'pending');
  expect(result).toEqual([]);

  });

  it('filtra correctamente una lista que contiene una sola tarea', () => {
  //Definiciones
  // Probamos el caso más pequeño posible: una lista con una sola tarea.
  // La idea es confirmar que el filtro también responde bien con pocos datos.
  const listaMinima: Task[] = [
    { id: '5', title: 'Enviar informe', status: 'pending' },
  ];

  const resultado = filterTasksByStatus(listaMinima, 'pending');

  expect(resultado).toHaveLength(1);
  expect(resultado).toEqual(listaMinima);
});



});
