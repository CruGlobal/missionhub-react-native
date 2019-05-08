/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  createThunkStore,
  createMockNavState,
  renderShallow,
  testSnapshotShallow,
} from '../../../../testUtils';
import { addNewPerson } from '../../../actions/organizations';
import { updatePerson } from '../../../actions/person';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../PersonStageScreen';
import {
  ACTIONS,
  ORG_PERMISSIONS,
  CANNOT_EDIT_FIRST_NAME,
} from '../../../constants';

import AddContactScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/person');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const me = { id: 99 };
const contactId = 23;
const contactFName = 'Lebron';
const organization = { id: 2 };
const mockContactAssignment = { id: 123, assigned_to: me };
const person = {
  id: contactId,
  first_name: contactFName,
  organization,
  reverse_contact_assignments: [mockContactAssignment],
};

const addNewPersonResponse = { type: 'add new person', response: person };
const updatePersonResponse = { type: 'update person', response: person };
const trackActionResponse = { type: 'track action' };
const nextResponse = { type: 'next' };

const next = jest.fn();

const mockStore = configureStore([thunk]);
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

beforeEach(() => {
  addNewPerson.mockReturnValue(addNewPersonResponse);
  updatePerson.mockReturnValue(updatePersonResponse);
  trackActionWithoutData.mockReturnValue(trackActionResponse);
  next.mockReturnValue(nextResponse);

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
  const savedPerson = { id: '1112' };
  let component;

  beforeEach(() => {
    component = buildScreenInstance({
      navigation: createMockNavState({ next, organization }),
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
  let navPerson = undefined;
  let navOrg = undefined;
  let screen;

  const newName = 'new name';

  beforeEach(async () => {
    screen = buildScreen({
      navigation: createMockNavState({
        person: navPerson,
        organization: navOrg,
        next,
      }),
    });

    screen.instance().setState({
      person: {
        ...screen.instance().state.person,
        first_name: newName,
      },
    });

    await screen
      .childAt(1)
      .childAt(1)
      .props()
      .onPress();
  });

  describe('add new person', () => {
    beforeAll(() => {
      navPerson = undefined;
    });

    describe('without org', () => {
      beforeAll(() => {
        navOrg = undefined;
      });

      it('should add a new person', () => {
        expect(addNewPerson).toHaveBeenCalledWith({
          assignToMe: true,
          first_name: contactFName,
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(
          ACTIONS.PERSON_ADDED,
        );
        expect(next).toHaveBeenCalledWith({
          person: addNewPersonResponse.response,
          orgId: undefined,
          didSavePerson: true,
        });
        expect(store.getActions()).toEqual([
          addNewPersonResponse,
          trackActionResponse,
          nextResponse,
        ]);
      });
    });

    describe('with org', () => {
      beforeAll(() => {
        navOrg = organization;
      });

      it('should add a new person', () => {
        expect(addNewPerson).toHaveBeenCalledWith({
          first_name: contactFName,
          orgId: organization.id,
          assignToMe: true,
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(
          ACTIONS.PERSON_ADDED,
        );
        expect(next).toHaveBeenCalledWith({
          person: addNewPersonResponse.response,
          orgId: organization.id,
          didSavePerson: true,
        });
        expect(store.getActions()).toEqual([
          addNewPersonResponse,
          trackActionResponse,
          nextResponse,
        ]);
      });
    });
  });

  describe('update existing person', () => {
    beforeAll(() => {
      navPerson = person;
    });

    describe('without org', () => {
      beforeAll(() => {
        navOrg = undefined;
      });

      it('should update person and navigate back', () => {
        expect(updatePerson).toHaveBeenCalledWith({
          first_name: contactFName,
          assignToMe: true,
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({
          person: updatePersonResponse.response,
          orgId: undefined,
          didSavePerson: true,
        });
        expect(store.getActions()).toEqual([
          updatePersonResponse,
          nextResponse,
        ]);
      });
    });

    describe('with org', () => {
      beforeAll(() => {
        navOrg = organization;
      });

      it('should update person and navigate back', () => {
        expect(updatePerson).toHaveBeenCalledWith({
          ...person,
          first_name: contactFName,
          assignToMe: true,
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({
          person: updatePersonResponse.response,
          orgId: organization.id,
          didSavePerson: true,
        });
        expect(store.getActions()).toEqual([
          updatePersonResponse,
          nextResponse,
        ]);
      });
    });
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
