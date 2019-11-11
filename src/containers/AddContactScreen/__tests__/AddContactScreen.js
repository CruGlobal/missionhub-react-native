/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';

import {
  createMockNavState,
  renderShallow,
  testSnapshotShallow,
} from '../../../../testUtils';
import { addNewPerson } from '../../../actions/organizations';
import { updatePerson } from '../../../actions/person';
import { trackActionWithoutData } from '../../../actions/analytics';
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

let addNewPersonResponse = { type: 'add new person', response: person };
const updatePersonResponse = { type: 'update person', response: person };
const trackActionResponse = { type: 'track action' };
const nextResponse = { type: 'next' };

const next = jest.fn();

let store;
const state = {
  auth: { person: me },
};

let component;
let instance;

function buildScreen(props) {
  component = renderShallow(<AddContactScreen {...props} />, store);
  return component;
}

function buildScreenInstance(props) {
  instance = buildScreen(props).instance();
  return instance;
}

beforeEach(() => {
  addNewPerson.mockReturnValue(addNewPersonResponse);
  updatePerson.mockReturnValue(updatePersonResponse);
  trackActionWithoutData.mockReturnValue(trackActionResponse);
  next.mockReturnValue(nextResponse);
  Alert.alert = jest.fn();

  store = configureStore([thunk])(state);
});

it('renders correctly', () => {
  testSnapshotShallow(
    <AddContactScreen navigation={createMockNavState({ next })} />,
    store,
  );
});

describe('handleUpdateData', () => {
  it('should update the state', () => {
    buildScreen({ navigation: createMockNavState() });

    component
      .childAt(1)
      .childAt(0)
      .props()
      .onUpdateData({ firstName: contactFName });

    expect(component.instance().state).toEqual({
      person: { firstName: contactFName },
    });
  });
});

describe('completeWithoutSave', () => {
  beforeEach(() => {
    buildScreenInstance({
      navigation: createMockNavState({ next, person, organization }),
    });

    instance.completeWithoutSave();
  });

  it('calls next', () => {
    expect(next).toHaveBeenCalledWith({
      person: undefined,
      orgId: organization.id,
      didSavePerson: false,
    });
  });
});

describe('savePerson', () => {
  let navPerson = undefined;
  let navOrg = undefined;
  let newData = {};

  const newName = 'new name';

  beforeEach(async () => {
    buildScreen({
      navigation: createMockNavState({
        person: navPerson,
        organization: navOrg,
        next,
      }),
    });

    component.instance().setState({
      person: {
        ...component.instance().state.person,
        ...newData,
      },
    });

    await component
      .childAt(2)
      .props()
      .onPress();
  });

  describe('add new person', () => {
    beforeAll(() => {
      navPerson = undefined;
      newData = { firstName: newName };
    });

    describe('without org', () => {
      beforeAll(() => {
        navOrg = undefined;
      });

      it('should add a new person', () => {
        expect(addNewPerson).toHaveBeenCalledWith({
          assignToMe: true,
          firstName: newName,
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
          firstName: newName,
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
      newData = { firstName: newName };
    });

    describe('without org', () => {
      beforeAll(() => {
        navOrg = undefined;
      });

      it('should update person and navigate back', () => {
        expect(updatePerson).toHaveBeenCalledWith({
          ...navPerson,
          firstName: newName,
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
          ...navPerson,
          firstName: newName,
          orgId: organization.id,
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

    describe('set last name to null', () => {
      beforeAll(() => {
        navOrg = undefined;
        newData = { lastName: '' };
      });

      it('should update person and navigate back', () => {
        expect(updatePerson).toHaveBeenCalledWith({
          ...navPerson,
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
  });

  describe('show alert', () => {
    beforeAll(() => {
      navPerson = undefined;
      navOrg = organization;
    });

    const test = () => {
      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('addContact:alertBlankEmail'),
        i18next.t('addContact:alertPermissionsMustHaveEmail'),
      );
    };

    describe('admin permissions', () => {
      beforeAll(() => {
        newData = { orgPermission: { permission_id: ORG_PERMISSIONS.ADMIN } };
      });

      describe('blank email, new firstName', () => {
        beforeAll(() => {
          newData = { ...newData, firstName: newName, email: '' };
        });

        it('shows alert', () => {
          test();
        });
      });

      describe('new email, blank firstName', () => {
        beforeAll(() => {
          newData = { ...newData, firstName: '', email: 'test' };
        });

        it('shows alert', () => {
          test();
        });
      });
    });

    describe('user permissions', () => {
      beforeAll(() => {
        newData = { orgPermission: { permission_id: ORG_PERMISSIONS.USER } };
      });

      describe('blank email, new firstName', () => {
        beforeAll(() => {
          newData = { ...newData, firstName: newName, email: '' };
        });

        it('shows alert', () => {
          test();
        });
      });

      describe('new email, blank firstName', () => {
        beforeAll(() => {
          newData = { ...newData, firstName: '', email: 'test' };
        });

        it('shows alert', () => {
          test();
        });
      });
    });

    describe('update user fails', () => {
      beforeAll(() => {
        addNewPersonResponse = () =>
          Promise.reject({
            apiError: {
              errors: [
                {
                  detail: CANNOT_EDIT_FIRST_NAME,
                },
              ],
            },
          });
        navPerson = undefined;
        navOrg = undefined;
        newData = { firstName: newName, email: 'test' };
      });

      it('shows alert', () => {
        expect(Alert.alert).toHaveBeenCalledWith(
          i18next.t('addContact:alertSorry'),
          i18next.t('addContact:alertCannotEditFirstName'),
        );
      });
    });
  });
});
