import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

describe('useCounter', () => {
  it('inicia con el valor por defecto (0)', async () => {
    const { result } = await renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('inicia con el valor proporcionado', async () => {
    const { result } = await renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('incrementa el contador en 1', async () => {
    const { result } = await renderHook(() => useCounter());
    await act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('decrementa el contador en 1', async () => {
    const { result } = await renderHook(() => useCounter(5));
    await act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(4);
  });

  it('reinicia el contador al valor inicial', async () => {
    const { result } = await renderHook(() => useCounter(10));
    await act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(12);

    await act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });

    /// Pruebas Nuevas de acuerdo a las sugerencias del segundo Punto

  it('aplica correctamente varias operaciones consecutivas', async () => {
    // Se ejecutan varios cambios dentro del mismo bloque para comprobar que
    // el hook procese cada actualización sin perder operaciones intermedias.
    const { result } = await renderHook(() => useCounter(2));

    await act(() => {
      result.current.increment();
      result.current.increment();
      result.current.decrement();
    });

    // El contador inicia en 2, sube dos veces y luego disminuye una vez.
    expect(result.current.count).toBe(3);
  });

  it('permite decrementar el contador por debajo de cero', async () => {
    // Se valida el comportamiento en el límite inferior, ya que el hook
    // no tiene una restricción que impida trabajar con valores negativos.
    const { result } = await renderHook(() => useCounter());

    await act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });

});