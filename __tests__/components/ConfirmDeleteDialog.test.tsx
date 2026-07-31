import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

// En estas pruebas se aíslan las funciones que el diálogo recibe por propiedades.
// Cuando solo necesito renderizar el componente uso noop, ya que no se espera ninguna acción.
// En los casos donde debo comprobar una llamada, uso jest.fn(), porque permite registrar
// si onConfirm u onCancel se ejecutaron y cuántas veces.
const noop = () => {};

describe('ConfirmDeleteDialog', () => {

  it('muestra el texto "Eliminar tarea" cuando el diálogo está visible', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={noop} onCancel={noop} />
    );
    expect(screen.getByText('Eliminar tarea')).toBeTruthy();
  });

  it('muestra el texto "¿Seguro que quieres eliminar `Cocinar`?" cuando el diálogo está visible', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Cocinar" onConfirm={noop} onCancel={noop} />
    );
    expect(screen.getByText(`¿Seguro que quieres eliminar "Cocinar"? Esta acción no se puede deshacer.`)).toBeTruthy();
  });

  it('llama a onConfirm al presionar "Eliminar"', async () => {
    const onConfirm = jest.fn();
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={onConfirm} onCancel={noop} />
    );
    await fireEvent.press(screen.getByLabelText('Confirmar eliminación'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('llama a onCancel al presionar "Cancelar"', async () => {
    const onCancel = jest.fn();
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={noop} onCancel={onCancel} />
    );
    await fireEvent.press(screen.getByLabelText('Cancelar'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  /// Pruebas nuevas de acuerdo con el tercer punto de la actividad

  it('muestra un mensaje general cuando no recibe el título de la tarea', async () => {
    // En esta prueba no envío el nombre de la tarea para revisar
    // qué mensaje muestra el diálogo cuando falta ese dato.
    await render(
      <ConfirmDeleteDialog
        visible
        onConfirm={noop}
        onCancel={noop}
      />
    );

    expect(
      screen.getByText(
        '¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer.'
      )
    ).toBeTruthy();
  });

  it('no muestra el contenido cuando el diálogo está cerrado', async () => {
    // Aquí dejo la propiedad visible en false para comprobar
    // que el diálogo no aparezca en pantalla.
    await render(
      <ConfirmDeleteDialog
        visible={false}
        taskTitle="Preparar informe"
        onConfirm={noop}
        onCancel={noop}
      />
    );

    expect(screen.queryByText('Eliminar tarea')).toBeNull();
  });


});
