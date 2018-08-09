import React from 'react';

import {
  createMockStore,
  createMockNavState,
  renderShallow,
  testSnapshotShallow,
} from '../../testUtils';
import AddContactScreen from '../../src/containers/AddContactScreen';
import { addNewContact } from '../../src/actions/organizations';
import { updatePerson } from '../../src/actions/person';
import * as organizations from '../../src/actions/organizations';
import * as person from '../../src/actions/person';
import { navigateBack, navigatePush } from '../../src/actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';

const me = { id: 99 };
const contactId = 23;
const contactFName = 'Lebron';
const organization = { id: 2 };

const mockContactAssignment = { id: 123, assigned_to: me };

const mockAddNewContact = {
  type: 'add new contact',
  response: {
    id: contactId,
    first_name: contactFName,
    organization,
    reverse_contact_assignments: [mockContactAssignment],
  },
};
jest.mock('../../src/actions/organizations', () => ({
  addNewContact: jest.fn(() => mockAddNewContact),
}));
const mockUpdatePerson = {
  type: 'update person',
  response: {
    id: contactId,
    first_name: contactFName,
    organization,
    reverse_contact_assignments: [mockContactAssignment],
  },
};
jest.mock('../../src/actions/person', () => ({
  updatePerson: jest.fn(() => mockUpdatePerson),
}));

jest.mock('../../src/actions/navigation');

jest.mock('react-native-device-info');

const store = createMockStore({
  auth: { person: me },
});

function buildScreen(props) {
  return renderShallow(<AddContactScreen {...props} />, store);
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

beforeEach(() =>
  organizations.addNewContact.mockImplementation(
    jest.fn(() => mockAddNewContact),
  ));

it('renders correctly', () => {
  testSnapshotShallow(
    <AddContactScreen navigation={createMockNavState()} />,
    store,
  );
});

describe('handleUpdateData', () => {
  it('should update the state', () => {
    const component = buildScreenInstance({ navigation: createMockNavState() });

    component.handleUpdateData({ firstName: contactFName });

    expect(component.state).toEqual({
      person: { firstName: contactFName },
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
  it('should add a new person', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
    });
    componentInstance.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(addNewContact).toHaveBeenCalledWith({ first_name: contactFName });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewContact);
  });

  it('should add a new person with an org', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
      organization,
    });
    componentInstance.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(addNewContact).toHaveBeenCalledWith({
      first_name: contactFName,
      orgId: organization.id,
    });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewContact);
  });

  it('should navigate to person stage screen', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
      organization: organization,
    });
    componentInstance.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(store.dispatch).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      onCompleteCelebration: expect.anything(),
      addingContactFlow: true,
      enableBackButton: false,
      currentStage: null,
      name: contactFName,
      contactId: contactId,
      contactAssignmentId: mockContactAssignment.id,
      section: 'people',
      subsection: 'person',
      orgId: organization.id,
    });
  });

  it('should update person with a callback', async () => {
    const onCompleteMock = jest.fn();
    const component = buildScreen({
      navigation: createMockNavState(),
      onComplete: onCompleteMock,
      person: { id: contactId },
    });
    const componentInstance = component.instance();
    component.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(addNewContact).toHaveBeenCalledWith({ first_name: contactFName });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewContact);
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
    expect(navigateBack).toHaveBeenCalledTimes(0);
  });

  it('should update person and navigate back', async () => {
    const component = buildScreen({
      navigation: createMockNavState(),
      person: { id: contactId },
    });
    const componentInstance = component.instance();

    component.setState({
      person: {
        ...componentInstance.state.person,
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(updatePerson).toHaveBeenCalledWith({
      first_name: contactFName,
      id: contactId,
    });
    expect(store.dispatch).toHaveBeenCalledWith(mockUpdatePerson);
    expect(navigateBack).toHaveBeenCalled();
  });

  it('should update person if person already created in add contact flow', async () => {
    const component = buildScreen({ navigation: createMockNavState() });
    const componentInstance = component.instance();
    component.setState({
      person: {
        first_name: contactFName,
        id: contactId,
      },
    });

    person.updatePerson.mockImplementation(() => mockUpdatePerson);

    await componentInstance.savePerson();

    expect(updatePerson).toHaveBeenCalledWith({
      first_name: contactFName,
      id: contactId,
    });
    expect(store.dispatch).toHaveBeenCalledWith(mockUpdatePerson);
    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      onCompleteCelebration: expect.anything(),
      addingContactFlow: true,
      enableBackButton: false,
      currentStage: null,
      name: contactFName,
      contactId: contactId,
      contactAssignmentId: mockContactAssignment.id,
      section: 'people',
      subsection: 'person',
      orgId: organization.id,
    });
  });

  it('should set the last_name to null when updating to blank string', async () => {
    const component = buildScreen({
      navigation: createMockNavState(),
      person: { id: contactId, last_name: null },
    });
    const componentInstance = component.instance();

    component.setState({
      person: {
        id: contactId,
        lastName: '',
      },
    });

    await componentInstance.savePerson();

    expect(updatePerson).toHaveBeenCalledWith({
      id: contactId,
    });
  });
});
