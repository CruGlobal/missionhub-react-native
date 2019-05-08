/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';

import {
  createThunkStore,
  createMockNavState,
  renderShallow,
  testSnapshotShallow,
} from '../../../../testUtils';

import AddContactScreen from '..';

import { addNewPerson } from '../../../actions/organizations';
import { updatePerson } from '../../../actions/person';
import * as organizations from '../../../actions/organizations';
import * as person from '../../../actions/person';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../PersonStageScreen';
import { ORG_PERMISSIONS, CANNOT_EDIT_FIRST_NAME } from '../../../constants';

const me = { id: 99 };
const contactId = 23;
const contactFName = 'Lebron';
const organization = { id: 2 };

const mockContactAssignment = { id: 123, assigned_to: me };

const navigateBackResult = { type: 'navigated back' };

const mockAddNewPerson = {
  type: 'add new person',
  response: {
    id: contactId,
    first_name: contactFName,
    organization,
    reverse_contact_assignments: [mockContactAssignment],
  },
};
jest.mock('../../../actions/organizations', () => ({
  addNewPerson: jest.fn(() => mockAddNewPerson),
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
jest.mock('../../../actions/person', () => ({
  updatePerson: jest.fn(() => mockUpdatePerson),
}));

jest.mock('../../../actions/navigation');

jest.mock('react-native-device-info');

let store;
const state = {
  auth: { person: me },
};

function buildScreen(props) {
  return renderShallow(<AddContactScreen {...props} />, store);
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

navigateBack.mockReturnValue(navigateBackResult);

beforeEach(() => {
  organizations.addNewPerson.mockImplementation(
    jest.fn(() => mockAddNewPerson),
  );

  store = createThunkStore(state);
});

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
  const mockNext = jest.fn().mockReturnValue({ type: 'test' });
  const savedPerson = { id: '1112' };
  let component;

  beforeEach(() => {
    component = buildScreenInstance({
      navigation: createMockNavState({ next: mockNext, organization }),
    });
  });

  it('should run next after save', () => {
    component.complete(true, savedPerson);

    expect(mockNext).toHaveBeenCalledWith({
      savedPerson: true,
      person: savedPerson,
      orgId: organization.id,
    });
  });

  it('should run next without save', () => {
    component.complete(false, savedPerson);

    expect(mockNext).toHaveBeenCalledWith({
      savedPerson: false,
      person: savedPerson,
      orgId: organization.id,
    });
  });
});

describe('savePerson', () => {
  it('should add a new person', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
      isEdit: false,
    });
    componentInstance.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(addNewPerson).toHaveBeenCalledWith({
      assignToMe: true,
      first_name: contactFName,
    });
    expect(store.getActions()).toEqual([mockAddNewPerson]);
  });

  it('should add a new person with an org', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
      organization,
      isEdit: false,
    });
    componentInstance.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(addNewPerson).toHaveBeenCalledWith({
      first_name: contactFName,
      orgId: organization.id,
      assignToMe: true,
    });
    expect(store.getActions()).toEqual([mockAddNewPerson]);
  });

  it('should add a new person with an org without contact assignment', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
      organization,
      isInvite: true,
      isEdit: false,
    });
    componentInstance.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(addNewPerson).toHaveBeenCalledWith({
      first_name: contactFName,
      orgId: organization.id,
      assignToMe: false,
    });
    expect(store.getActions()).toEqual([mockAddNewPerson, navigateBackResult]);
    expect(navigatePush).not.toHaveBeenCalled();
  });

  it('should navigate to person stage screen', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
      organization,
      isEdit: false,
    });
    componentInstance.setState({
      person: {
        first_name: contactFName,
      },
    });

    await componentInstance.savePerson();

    expect(store.getActions()).toEqual([mockAddNewPerson]);
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
      assignToMe: true,
    });
    expect(store.getActions()).toEqual([mockUpdatePerson, navigateBackResult]);
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

    await componentInstance.savePersonTemp();

    expect(updatePerson).toHaveBeenCalledWith({
      first_name: contactFName,
      id: contactId,
      assignToMe: true,
    });
    expect(store.getActions()).toEqual([mockUpdatePerson]);
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
      orgId: undefined,
    });
  });

  it('should set the last_name to null when updating to blank string', async () => {
    const component = buildScreen({
      navigation: createMockNavState(),
      person: { id: contactId, last_name: null },
    });

    component.setState({
      person: {
        id: contactId,
        lastName: '',
      },
    });

    await component
      .childAt(1)
      .childAt(1)
      .props()
      .onPress();

    expect(updatePerson).toHaveBeenCalledWith({
      id: contactId,
      assignToMe: true,
    });
  });

  it('should alert with blank email and admin permission', async () => {
    Alert.alert = jest.fn();
    const component = buildScreen({
      navigation: createMockNavState(),
    });
    const componentInstance = component.instance();

    component.setState({
      person: {
        firstName: 'Test Name',
        email: '',
        orgPermission: { permission_id: ORG_PERMISSIONS.ADMIN },
      },
    });

    await componentInstance.savePerson();

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('should alert with blank name and admin permission', async () => {
    Alert.alert = jest.fn();
    const component = buildScreen({
      navigation: createMockNavState(),
    });
    const componentInstance = component.instance();

    component.setState({
      person: {
        firstName: '',
        email: 'test',
        orgPermission: { permission_id: ORG_PERMISSIONS.USER },
      },
    });

    await componentInstance.savePerson();

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('should alert with blank email and user permission', async () => {
    Alert.alert = jest.fn();
    const component = buildScreen({
      navigation: createMockNavState(),
    });
    const componentInstance = component.instance();

    component.setState({
      person: {
        email: '',
        orgPermission: { permission_id: ORG_PERMISSIONS.USER },
      },
    });

    await componentInstance.savePerson();

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('should throw an alert when the update user fails', async () => {
    const component = buildScreen({
      navigation: createMockNavState(),
      person: { id: contactId },
    });
    const componentInstance = component.instance();

    component.setState({
      person: {
        id: contactId,
        email: 'test',
        lastName: 'New Name',
      },
    });

    person.updatePerson = jest.fn(() =>
      Promise.reject({
        apiError: {
          errors: [
            {
              detail: CANNOT_EDIT_FIRST_NAME,
            },
          ],
        },
      }),
    );

    try {
      await componentInstance.savePerson();
    } catch (error) {
      expect(Alert.alert).toHaveBeenCalled();
    }
  });

  it('should navigate back', () => {
    const component = buildScreen({
      navigation: createMockNavState(),
      person: { id: contactId },
    });
    const componentInstance = component.instance();
    componentInstance.navigateBack();
    expect(navigateBack).toHaveBeenCalled();
  });
});
