import React from 'react';
import { Alert } from 'react-native';
import { DrawerActions } from 'react-navigation';

import PersonSideMenu from '..';

import {
  renderShallow,
  createMockStore,
  createMockNavState,
  testSnapshotShallow,
} from '../../../../testUtils';
import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { STATUS_REASON_SCREEN } from '../../../containers/StatusReasonScreen';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import {
  personSelector,
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../../../selectors/people';
import { deleteContactAssignment } from '../../../actions/person';
import { assignContactAndPickStage } from '../../../actions/misc';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../actions/steps');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/misc');
jest.mock('react-navigation', () => ({
  DrawerActions: {
    closeDrawer: jest.fn(),
  },
  createMaterialTopTabNavigator: jest.fn((_, component) => component),
}));

const me = { id: '1' };
const person = { id: '2', type: 'person', first_name: 'Test Fname' };
const orgPermission = {
  id: 4,
  type: 'organizational_permission',
  followup_status: 'uncontacted',
};
const contactAssignment = { id: '3', type: 'reverse_contact_assignment' };
const organization = { id: '4', type: 'organization' };

const store = createMockStore({
  auth: {
    person: me,
  },
  people: {
    allByOrg: {
      [organization.id]: {
        people: {
          [person.id]: person,
        },
      },
    },
  },
});

personSelector.mockReturnValue(person);

beforeEach(() => jest.clearAllMocks());

let component;

const createComponent = () => {
  component = renderShallow(
    <PersonSideMenu
      navigation={createMockNavState({
        person,
        organization,
        isCruOrg: true,
      })}
    />,
    store,
  );
};

describe('PersonSideMenu', () => {
  describe('person has org permission', () => {
    beforeEach(() => orgPermissionSelector.mockReturnValue(orgPermission));

    it('renders unassign correctly', () => {
      contactAssignmentSelector.mockReturnValue(contactAssignment);
      createComponent();

      expect(component).toMatchSnapshot();
      testEditClick(component, true);
      navigatePush.mockClear();
      testUnassignClick(component);
    });

    it('renders assign correctly', () => {
      contactAssignmentSelector.mockReturnValue(undefined);
      createComponent();

      expect(component).toMatchSnapshot();
      testEditClick(component, true);
      testAssignClick(component);
    });

    it('should navigate back 2 on submit reason', () => {
      createComponent();
      const instance = component.instance();
      instance.onSubmitReason();
      expect(navigateBack).toHaveBeenCalledWith(2);
    });
  });

  describe('person does not have org permission', () => {
    beforeEach(() => orgPermissionSelector.mockReturnValue(null));

    it('renders delete correctly', () => {
      contactAssignmentSelector.mockReturnValue(contactAssignment);

      component = testSnapshotShallow(
        <PersonSideMenu
          navigation={createMockNavState({
            person,
          })}
        />,
        store,
      );
    });

    it('should set deleteOnUnmount when person confirms delete', () => {
      contactAssignmentSelector.mockReturnValue(contactAssignment);
      component = renderShallow(
        <PersonSideMenu
          navigation={createMockNavState({
            person,
          })}
        />,
        store,
      );
      const props = component.props();
      Alert.alert = jest.fn();

      props.menuItems.find(item => item.label === 'Delete Person').action();

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      //Manually call onPress
      Alert.alert.mock.calls[0][2][1].onPress();
      expect(component.instance().deleteOnUnmount).toEqual(true);
      expect(DrawerActions.closeDrawer).toHaveBeenCalled();
      expect(navigateBack).toHaveBeenCalledTimes(1);
    });

    describe('componentWillUnmount', () => {
      beforeEach(() =>
        deleteContactAssignment.mockImplementation(response =>
          Promise.resolve(response),
        ));

      it('should delete person if deleteOnUnmount is set', async () => {
        createComponent();
        const instance = component.instance();
        instance.deleteOnUnmount = true;

        await instance.componentWillUnmount();

        expect(deleteContactAssignment).toHaveBeenCalledWith(
          contactAssignment.id,
          person.id,
          organization.id,
        );
      });

      it('should do nothing if deleteOnUnmount is not set', async () => {
        contactAssignmentSelector.mockReturnValue(contactAssignment);
        createComponent();
        const instance = component.instance();

        await instance.componentWillUnmount();

        expect(deleteContactAssignment).not.toHaveBeenCalled();
      });
    });
  });
});

function testEditClick(component) {
  const props = component.props();
  props.menuItems.filter(item => item.label === 'Edit')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
    person,
    organization,
    onComplete: expect.any(Function),
  });
}

function testAssignClick(component) {
  const props = component.props();
  props.menuItems.filter(item => item.label === 'Assign')[0].action();
  expect(assignContactAndPickStage).toHaveBeenCalledWith(
    person,
    organization,
    me.id,
  );
}

function testUnassignClick(component) {
  const props = component.props();
  const onSubmit = component.instance().onSubmitReason;

  props.menuItems.filter(item => item.label === 'Unassign')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(STATUS_REASON_SCREEN, {
    person,
    organization,
    contactAssignment,
    onSubmit,
  });
}
