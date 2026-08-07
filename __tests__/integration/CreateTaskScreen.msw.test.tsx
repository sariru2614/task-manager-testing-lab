import React from 'react';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

const API_URL = 'https://api.taskmanager.com';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen useApi />
    </SafeAreaProvider>
  );

describe('CreateTaskScreen - Integración con MSW', () => {
  it('crea una tarea cuando la API responde correctamente', async () => {
    await renderScreen();

    // Esperamos que termine la carga inicial de tareas.
    expect(await screen.findByText('No hay tareas aún')).toBeTruthy();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Preparar actividad 3'
    );

    await fireEvent.press(screen.getByText('Guardar'));

    expect(
      await screen.findByText('Tarea creada exitosamente')
    ).toBeTruthy();

    expect(screen.getByText('Preparar actividad 3')).toBeTruthy();
  });

  it('muestra un mensaje cuando la API falla al crear la tarea', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await renderScreen();

    expect(await screen.findByText('No hay tareas aún')).toBeTruthy();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea con error'
    );

    await fireEvent.press(screen.getByText('Guardar'));

    expect(
      await screen.findByText('Error al crear la tarea')
    ).toBeTruthy();

    expect(screen.queryByText('Tarea creada exitosamente')).toBeNull();
    expect(screen.queryByText('Tarea con error')).toBeNull();
  });

  it('muestra la lista vacía cuando la API no devuelve tareas', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () => {
        return HttpResponse.json([]);
      })
    );

    await renderScreen();

    expect(await screen.findByText('No hay tareas aún')).toBeTruthy();
  });
});