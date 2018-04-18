import React from 'react';
import { createMockStore, createMockNavState, renderShallow, testSnapshotShallow } from '../../testUtils';

import AddContactScreen from '../../src/containers/AddContactScreen';
import { addNewContact } from '../../src/actions/organizations';
import { updatePerson } from '../../src/actions/person';
import * as organizations from '../../src/actions/organizations';
import * as person from '../../src/actions/person';
import { navigateBack, navigatePush } from '../../src/actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';

const mockAddNewContact = { type: 'add new contact', findAll: () => [], response: { id: 23 } };
jest.mock('../../src/actions/organizations', () => ({
  addNewContact: jest.fn(() => mockAddNewContact),
}));
const mockUpdatePerson = { type: 'update person', findAll: () => [] };
jest.mock('../../src/actions/person', () => ({
  updatePerson: jest.fn(() => mockUpdatePerson),
}));

jest.mock('../../src/actions/navigation');

jest.mock('react-native-device-info');

const me = { id: 99 };
const organization = { id: 2 };
const store = createMockStore({
  auth: { person: me },
});

function buildScreen(props) {
  return renderShallow(
    <AddContactScreen {...props} />,
    store
  );
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

beforeEach(() => organizations.addNewContact.mockImplementation(jest.fn(() => mockAddNewContact)));

it('renders correctly', () => {
  testSnapshotShallow(
    <AddContactScreen navigation={createMockNavState()} />,
    store
  );
});

describe('handleUpdateData', () => {
  it('should update the state', () => {
    const component = buildScreenInstance({ navigation: createMockNavState() });

    component.handleUpdateData({ firstName: 'some data' });

    expect(component.state).toEqual({
      person: { firstName: 'some data' },
    });
  });
});

describe('complete', () => {
  it('should run the onComplete and navigateBack', () => {
    const mockComplete = jest.fn();
    const component = buildScreenInstance({
      navigation: createMockNavState({ onComplete: mockComplete }),
    });

    component.complete();

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});

describe('savePerson', () => {
  it('should add a new person', async() => {
    const componentInstance = buildScreenInstance({ navigation: createMockNavState() });
    componentInstance.setState({
      person: {
        first_name: 'Fname',
      },
    });

    await componentInstance.savePerson();

    expect(addNewContact).toHaveBeenCalledWith({ first_name: 'Fname' });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewContact);
    expect(navigateBack).toHaveBeenCalled();
  });

  it('should add a new person with an org', async() => {
    const componentInstance = buildScreenInstance({ navigation: createMockNavState(), organization: { id: 2 } });
    componentInstance.setState({
      person: {
        first_name: 'Fname',
      },
    });

    await componentInstance.savePerson();

    expect(addNewContact).toHaveBeenCalledWith({ first_name: 'Fname', orgId: 2 });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewContact);
    expect(navigateBack).toHaveBeenCalled();
  });

  it('should navigate to person stage screen', async() => {
    const newPerson = {
      type: 'person',
      id: 1000,
      first_name: 'LeBron',
      reverse_contact_assignments: [
        { id: 300,
          assigned_to: { id: me.id },
        },
      ],
    };
    const component = buildScreenInstance({ navigation: createMockNavState(), organization: organization });
    component.setState({
      person: {
        first_name: 'Fname',
      },
    });
    organizations.addNewContact.mockImplementation(() => ({ type: 'add new contact', findAll: () => [ newPerson ], response: { id: 23 } }));

    await component.savePerson();

    expect(store.dispatch).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      onCompleteCelebration: expect.anything(),
      addingContactFlow: true,
      enableBackButton: false,
      currentStage: null,
      name: newPerson.first_name,
      contactId: newPerson.id,
      contactAssignmentId: newPerson.reverse_contact_assignments[0].id,
      section: 'people',
      subsection: 'person',
      orgId: organization.id,
    });
  });

  it('should add a new person with a callback', async() => {
    const onCompleteMock = jest.fn();
    const component = buildScreen({ navigation: createMockNavState(), onComplete: onCompleteMock });
    const componentInstance = component.instance();
    component.setState({
      person: {
        first_name: 'Fname',
      },
    });

    await componentInstance.savePerson();

    expect(addNewContact).toHaveBeenCalledWith({ first_name: 'Fname' });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewContact);
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
    expect(navigateBack).toHaveBeenCalled();
  });

  it('should add a new person with a callback', async() => {
    const component = buildScreen({ navigation: createMockNavState(), person: { id: 1 } });
    const componentInstance = component.instance();

    component.setState({
      person: {
        ...componentInstance.state.person,
        first_name: 'Fname',
      },
    });

    await componentInstance.savePerson();

    expect(updatePerson).toHaveBeenCalledWith({ first_name: 'Fname', id: 1 });
    expect(store.dispatch).toHaveBeenCalledWith(mockUpdatePerson);
    expect(navigateBack).toHaveBeenCalled();
  });

  it('should update person if person already created in add contact flow', async() => {
    const component = buildScreen({ navigation: createMockNavState() });
    const componentInstance = component.instance();
    component.setState({
      person: {
        first_name: 'Fname',
        id: 23,
      },
    });
    const newPerson = {
      type: 'person',
      id: 1000,
      first_name: 'LeBron',
      reverse_contact_assignments: [
        { id: 300,
          assigned_to: { id: me.id },
        },
      ],
    };

    const updatePersonResponse = { type: 'update person', findAll: () => [ newPerson ] }
    person.updatePerson.mockImplementation(() => (updatePersonResponse));

    await componentInstance.savePerson();

    expect(updatePerson).toHaveBeenCalledWith({ first_name: 'Fname', id: 23 });
    expect(store.dispatch).toHaveBeenCalledWith(updatePersonResponse);
    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      onCompleteCelebration: expect.anything(),
      addingContactFlow: true,
      enableBackButton: false,
      currentStage: null,
      name: newPerson.first_name,
      contactId: newPerson.id,
      contactAssignmentId: newPerson.reverse_contact_assignments[0].id,
      section: 'people',
      subsection: 'person',
      orgId: organization.id,
    });
  });
});
