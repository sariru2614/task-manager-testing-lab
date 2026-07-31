import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm', () => {
// En estas pruebas se reemplaza onSubmit por una función simulada.
// de esta manera el formulario intenta enviar la tarea,
// sin ejecutar la lógica real asociada al guardado.
  it('llama a onSubmit con el título ingresado al presionar "Guardar"', async () => {
    const mockOnSubmit = jest.fn();
    await render(<TaskForm onSubmit={mockOnSubmit} />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Mi nueva tarea'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Mi nueva tarea');
  });

  it('no llama a onSubmit si el campo está vacío', async () => {
    const mockOnSubmit = jest.fn();
    await render(<TaskForm onSubmit={mockOnSubmit} />);

    await fireEvent.press(screen.getByText('Guardar'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  /// Pruebas nuevas de acuerdo con el tercer punto de la actividad

  it('actualiza el campo cuando el usuario escribe un título', async () => {
  // En esta prueba escribo un título para revisar que el campo
  // realmente guarde y muestre lo que ingresó el usuario.
  const mockOnSubmit = jest.fn();

  await render(<TaskForm onSubmit={mockOnSubmit} />);

  const campoTitulo = screen.getByTestId('input-titulo');

  await fireEvent.changeText(campoTitulo, 'Revisar informe');

  expect(campoTitulo).toHaveProp('value', 'Revisar informe');
  });

  it('no envía el formulario cuando el título contiene solo espacios', async () => {
  // Aquí ingreso únicamente espacios para comprobar que el formulario
  // no los tome como un título válido.
  const mockOnSubmit = jest.fn();

  await render(<TaskForm onSubmit={mockOnSubmit} />);

  const campoTitulo = screen.getByLabelText('Título de la tarea');
  const botonGuardar = screen.getByRole('button', { name: 'Guardar' });

  await fireEvent.changeText(campoTitulo, '   ');
  await fireEvent.press(botonGuardar);

  // Como no hay un título real, se usa un mock.
  expect(mockOnSubmit).not.toHaveBeenCalled();
  });

});
