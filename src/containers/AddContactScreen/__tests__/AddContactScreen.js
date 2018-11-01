import React from 'react';
import { Alert } from 'react-native';

import {
  createMockStore,
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

const store = createMockStore({
  auth: { person: me },
});

function buildScreen(props) {
  return renderShallow(<AddContactScreen {...props} />, store);
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

beforeEach(() => {
  jest.clearAllMocks();
  organizations.addNewPerson.mockImplementation(
    jest.fn(() => mockAddNewPerson),
  );
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

    expect(addNewPerson).toHaveBeenCalledWith({
      assignToMe: true,
      first_name: contactFName,
    });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewPerson);
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

    expect(addNewPerson).toHaveBeenCalledWith({
      first_name: contactFName,
      orgId: organization.id,
      assignToMe: true,
    });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewPerson);
  });

  it('should add a new person with an org without contact assignment', async () => {
    const componentInstance = buildScreenInstance({
      navigation: createMockNavState(),
      organization,
      isInvite: true,
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
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewPerson);
    expect(navigatePush).not.toHaveBeenCalled();
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

    expect(addNewPerson).toHaveBeenCalledWith({
      assignToMe: true,
      first_name: contactFName,
    });
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewPerson);
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
      assignToMe: true,
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
      assignToMe: true,
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
      orgId: undefined,
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
