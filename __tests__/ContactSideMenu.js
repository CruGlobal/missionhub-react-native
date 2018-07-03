import React from 'react';
import { Alert } from 'react-native';
import { DrawerActions, createMaterialTopTabNavigator } from 'react-navigation';
jest.mock('react-navigation', () => ({
  DrawerActions: {
    closeDrawer: jest.fn(),
  },
  createMaterialTopTabNavigator: jest.fn((_, component) => component),
}));

import {
  ContactSideMenu,
  mapStateToProps,
} from '../src/components/ContactSideMenu';
import { renderShallow, testSnapshotShallow } from '../testUtils';
import { ADD_CONTACT_SCREEN } from '../src/containers/AddContactScreen';
import { navigatePush, navigateBack } from '../src/actions/navigation';
import {
  updateFollowupStatus,
  createContactAssignment,
  deleteContactAssignment,
} from '../src/actions/person';
import {
  personSelector,
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../src/selectors/people';
jest.mock('../src/actions/navigation');
jest.mock('../src/actions/person');
jest.mock('../src/actions/steps');
jest.mock('../src/selectors/people');

const dispatch = jest.fn(response => Promise.resolve(response));
const person = { id: 2, type: 'person', first_name: 'Test Fname' };
const orgPermission = {
  id: 4,
  type: 'organizational_permission',
  followup_status: 'uncontacted',
};
const contactAssignment = { id: 3, type: 'reverse_contact_assignment' };
const organization = { id: 1, type: 'organization' };

beforeEach(() => {
  dispatch.mockClear();
  navigateBack.mockClear();
  navigatePush.mockClear();
  deleteContactAssignment.mockClear();
});

describe('contactSideMenu', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      personSelector.mockReturnValue(person);
      contactAssignmentSelector.mockReturnValue(contactAssignment);
      orgPermissionSelector.mockReturnValue(orgPermission);
      expect(
        mapStateToProps(
          {
            auth: {
              isJean: true,
              person: {
                id: '1',
              },
            },
            people: {},
          },
          {
            navigation: {
              state: {
                params: {
                  person: {},
                  organization: organization,
                },
              },
            },
          },
        ),
      ).toMatchSnapshot();
    });
  });

  describe('componentWillUnmount', () => {
    beforeEach(() => {
      deleteContactAssignment.mockImplementation(response =>
        Promise.resolve(response),
      );
    });
    it('should delete person if deleteOnUnmount is set', async () => {
      const instance = renderShallow(
        <ContactSideMenu
          dispatch={dispatch}
          person={{
            ...person,
            received_challenges: [{ id: 1 }, { id: 2 }],
          }}
          contactAssignment={contactAssignment}
          organization={organization}
        />,
      ).instance();
      instance.deleteOnUnmount = true;
      await instance.componentWillUnmount();
      expect(deleteContactAssignment).toHaveBeenCalledWith(
        contactAssignment.id,
        person.id,
        organization.id,
      );
    });
    it('should do nothing if deleteOnUnmount is not set', async () => {
      const instance = renderShallow(
        <ContactSideMenu
          dispatch={dispatch}
          person={{
            ...person,
            received_challenges: [{ id: 1 }, { id: 2 }],
          }}
          contactAssignment={contactAssignment}
          organization={organization}
        />,
      ).instance();
      await instance.componentWillUnmount();
      expect(deleteContactAssignment).not.toHaveBeenCalled();
    });
  });

  describe('Casey', () => {
    it('renders correctly with delete', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={false}
          personIsCurrentUser={false}
          person={person}
          contactAssignment={contactAssignment}
        />,
      );

      testEditClick(component, false);
      testDeleteClick(component);
    });
    it('renders correctly with assign', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={false}
          myId={1}
          personIsCurrentUser={false}
          person={person}
          organization={organization}
        />,
      );

      testEditClick(component, false);
      testAssignClick(component);
    });
    it('renders me user correctly', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={false}
          personIsCurrentUser={true}
          person={person}
        />,
      );

      testEditClick(component, false);
    });
  });

  describe('Jean', () => {
    it('renders me user correctly', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={true}
          personIsCurrentUser={true}
          person={person}
        />,
      );

      testEditClick(component, true);
    });
    it('renders menu with delete', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={true}
          personIsCurrentUser={false}
          person={person}
          contactAssignment={contactAssignment}
        />,
      );

      testEditClick(component, true);
      testDeleteClick(component);
    });
    it('renders unassign correctly', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={true}
          personIsCurrentUser={false}
          person={person}
          contactAssignment={contactAssignment}
          orgPermission={orgPermission}
        />,
      );

      testEditClick(component, true);
      testUnassignClick(component);
    });
    it('renders assign correctly', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={true}
          myId={1}
          personIsCurrentUser={false}
          person={person}
          organization={organization}
        />,
      );

      testEditClick(component, true);
      testAssignClick(component);
    });

    it('handles followup status clicks correctly', () => {
      const component = testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={true}
          myId={1}
          personIsCurrentUser={false}
          person={person}
          orgPermission={orgPermission}
          organization={organization}
        />,
      );

      testEditClick(component, true);
      testAssignClick(component);
      testFollowupStatusClick(
        component,
        'Attempted Contact',
        person,
        orgPermission.id,
        'attempted_contact',
      );
      testFollowupStatusClick(
        component,
        'Completed',
        person,
        orgPermission.id,
        'completed',
      );
      testFollowupStatusClick(
        component,
        'Contacted',
        person,
        orgPermission.id,
        'contacted',
      );
      testFollowupStatusClick(
        component,
        'Do Not Contact',
        person,
        orgPermission.id,
        'do_not_contact',
      );
      testFollowupStatusClick(
        component,
        'Uncontacted',
        person,
        orgPermission.id,
        'uncontacted',
      );
    });

    it('should hide followup status for Missionhub users', () => {
      testSnapshotShallow(
        <ContactSideMenu
          dispatch={dispatch}
          isJean={true}
          myId={1}
          personIsCurrentUser={false}
          person={person}
          isMissionhubUser={false}
          organization={organization}
        />,
      );
    });
  });
});

function testEditClick(component, isJean) {
  const props = component.props();
  props.menuItems.filter(item => item.label === 'Edit')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
    isJean: isJean,
    person: person,
    onComplete: expect.any(Function),
  });
}

function testAssignClick(component) {
  const props = component.props();
  props.menuItems.filter(item => item.label === 'Assign')[0].action();
  expect(createContactAssignment).toHaveBeenCalledWith(
    organization.id,
    1,
    person.id,
  );
}

function testUnassignClick(component, deleteMode = false) {
  const props = component.props();
  Alert.alert = jest.fn();
  props.menuItems
    .filter(
      item => item.label === (deleteMode ? 'Delete Person' : 'Unassign'),
    )[0]
    .action();
  expect(Alert.alert).toHaveBeenCalledTimes(1);

  //Manually call onPress
  Alert.alert.mock.calls[0][2][1].onPress();
  expect(component.instance().deleteOnUnmount).toEqual(true);
  expect(DrawerActions.closeDrawer).toHaveBeenCalled();
  expect(navigateBack).toHaveBeenCalledTimes(1);
}

function testDeleteClick(component) {
  testUnassignClick(component, true);
}

function testFollowupStatusClick(
  component,
  label,
  person,
  orgPermissionId,
  serverValue,
) {
  const props = component.props();
  props.menuItems.filter(item => item.label === label)[0].action();
  expect(updateFollowupStatus).toHaveBeenCalledWith(
    person,
    orgPermissionId,
    serverValue,
  );
}
