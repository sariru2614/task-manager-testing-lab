import { validateTaskTitle } from '../../src/utils/validateTask';

describe('validateTaskTitle', () => {
  describe('cuando el título es válido', () => {
    it('retorna null para un título con longitud válida', () => {
      expect(validateTaskTitle('Comprar leche')).toBeNull();
    });

    it('retorna null para un título con exactamente 3 caracteres', () => {
      expect(validateTaskTitle('Abc')).toBeNull();
    });

    it('retorna null para un título con exactamente 100 caracteres', () => {
      const titulo100 = 'A'.repeat(100);
      expect(validateTaskTitle(titulo100)).toBeNull();
    });
  });

  describe('cuando el título es inválido', () => {
    it('retorna mensaje de error para un string vacío', () => {
      expect(validateTaskTitle('')).toBe('El título es obligatorio');
    });

    it('retorna mensaje de error para un string con solo espacios', () => {
      expect(validateTaskTitle('   ')).toBe('El título es obligatorio');
    });

    it('retorna mensaje de error para un título con menos de 3 caracteres', () => {
      expect(validateTaskTitle('Ab')).toBe('El título debe tener al menos 3 caracteres');
    });

    it('retorna mensaje de error para un título con más de 100 caracteres', () => {
      const titulo101 = 'A'.repeat(101);
      expect(validateTaskTitle(titulo101)).toBe('El título no puede exceder los 100 caracteres');
    });


    // Pruebas Nuevas de acuerdo a las sugerencias del primer punto

    it('retorna el mensaje de campo obligatorio cuando recibe un valor nulo', () => {

      //Definiciones
      // Aunque TypeScript espera un string, en tiempo de ejecución podría llegar
      // un valor nulo desde un formulario, una API o una fuente externa.
      const tituloNulo = null;
      // @ts-expect-error Se envía null.
      const result = validateTaskTitle(tituloNulo);


      expect(result).toBe('El título es obligatorio');

    });

    it('acepta un titulo valido aunque tenga espacios al inicio y al final', () => {

      // Definiciones
      // El contenido útil tiene tres caracteres. Los espacios externos no deberían
      // provocar que un título válido sea rechazado.
      const titulo = '  REACT  ';
      const result = validateTaskTitle(titulo);
      expect(result).toBeNull();

    });

    it('rechaza un titulo que queda por debajo de la longitud minima después de quitar espacios', () => {
    // Definiciones
    // Aunque la cadena completa contiene más caracteres, el valor real ingresado
    // solo tiene dos letras después de eliminar los espacios externos.
    const titulo = '  RE  ';
    const result = validateTaskTitle(titulo);

    expect(result).toBe('El título debe tener al menos 3 caracteres');

    });

    it('retorna el mensaje de campo obligatorio cuando recibe undefined', () => {
    //Definciones
    // Este valor puede aparecer cuando el formulario todavía no ha inicializado
    // el título o cuando falta información en una integración.
    const tituloSinDefinir = undefined;

    // @ts-expect-error Se envía undefined.
    const resultado = validateTaskTitle(tituloSinDefinir);

    expect(resultado).toBe('El título es obligatorio');
    });

  });
});
