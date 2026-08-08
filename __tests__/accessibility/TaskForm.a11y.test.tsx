import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm - Accesibilidad', () => {
  it('el campo de título tiene una etiqueta accesible descriptiva', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText('Título de la tarea')).toBeTruthy();
  });

  it('el botón Guardar tiene rol accesible de botón', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Guardar' })).toBeTruthy();
  });
});