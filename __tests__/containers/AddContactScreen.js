import React from 'react';
import { createMockStore, createMockNavState, renderShallow, testSnapshotShallow } from '../../testUtils';

import AddContactScreen from '../../src/containers/AddContactScreen';
import { addNewContact } from '../../src/actions/organizations';
import { updatePerson } from '../../src/actions/profile';
jest.mock('../../src/actions/organizations', () => ({
  addNewContact: jest.fn(() => 'addNewContact response'),
}));
jest.mock('../../src/actions/profile', () => ({
  updatePerson: jest.fn(() => 'updatePerson response'),
}));
import { navigateBack } from '../../src/actions/navigation';
jest.mock('../../src/actions/navigation');

jest.mock('react-native-device-info');

const store = createMockStore();

it('renders correctly', () => {
  testSnapshotShallow(
    <AddContactScreen navigation={createMockNavState()} />,
    store
  );
});

describe('handleUpdateData', () => {
  it('should update the state', () => {
    const component = renderShallow(
      <AddContactScreen navigation={createMockNavState()} />,
      store
    ).instance();
    component.handleUpdateData('some data');
    expect(component.state).toEqual({
      data: 'some data',
    });
  });
});

describe('savePerson', () => {
  it('should add a new person', async() => {
    const component = renderShallow(
      <AddContactScreen navigation={createMockNavState()} />,
      store
    );
    const componentInstance = component.instance();
    component.setState({
      data: {
        first_name: 'Fname',
      },
    });
    await componentInstance.savePerson();
    expect(addNewContact).toHaveBeenCalledWith({ first_name: 'Fname' });
    expect(store.dispatch).toHaveBeenCalledWith('addNewContact response');
    expect(navigateBack).toHaveBeenCalled();
  });
  it('should add a new person with an org', async() => {
    const component = renderShallow(
      <AddContactScreen navigation={createMockNavState()} organization={{ id: 2 }} />,
      store
    );
    const componentInstance = component.instance();
    component.setState({
      data: {
        first_name: 'Fname',
      },
    });
    await componentInstance.savePerson();
    expect(addNewContact).toHaveBeenCalledWith({ first_name: 'Fname', orgId: 2 });
    expect(store.dispatch).toHaveBeenCalledWith('addNewContact response');
    expect(navigateBack).toHaveBeenCalled();
  });
  it('should add a new person with a callback', async() => {
    const onCompleteMock = jest.fn();
    const component = renderShallow(
      <AddContactScreen navigation={createMockNavState()} onComplete={onCompleteMock} />,
      store
    );
    const componentInstance = component.instance();
    component.setState({
      data: {
        first_name: 'Fname',
      },
    });
    await componentInstance.savePerson();
    expect(addNewContact).toHaveBeenCalledWith({ first_name: 'Fname' });
    expect(store.dispatch).toHaveBeenCalledWith('addNewContact response');
    expect(onCompleteMock).toHaveBeenCalledWith('addNewContact response');
    expect(navigateBack).toHaveBeenCalled();
  });
  it('should add a new person with a callback', async() => {
    const component = renderShallow(
      <AddContactScreen navigation={createMockNavState()} />,
      store
    );
    const componentInstance = component.instance();
    component.setProps({
      person: {
        id: 1,
      },
    });
    component.setState({
      data: {
        first_name: 'Fname',
      },
    });
    await componentInstance.savePerson();
    expect(updatePerson).toHaveBeenCalledWith({ first_name: 'Fname' });
    expect(store.dispatch).toHaveBeenCalledWith('updatePerson response');
    expect(navigateBack).toHaveBeenCalled();
  });
});
