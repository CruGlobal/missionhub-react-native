import React from 'react';
import { DrawerActions } from 'react-navigation';
jest.mock('react-navigation', () => ({
  DrawerActions: {
    closeDrawer: jest.fn(),
  },
  createMaterialTopTabNavigator: jest.fn((_, component) => component),
}));

import {
  PersonSideMenu,
  mapStateToProps,
} from '../../src/components/PersonSideMenu';
import { renderShallow, testSnapshotShallow } from '../../testUtils';
import { ADD_CONTACT_SCREEN } from '../../src/containers/AddContactScreen';
import { navigatePush, navigateBack } from '../../src/actions/navigation';
import {
  personSelector,
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../../src/selectors/people';
jest.mock('../../src/actions/navigation');
jest.mock('../../src/actions/person');
jest.mock('../../src/actions/steps');
jest.mock('../../src/selectors/people');

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

describe('PersonSideMenu', () => {
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
            people: {
              allByOrg: {
                [organization.id]: {
                  people: {
                    [person.id]: person,
                  },
                },
              },
            },
          },
          {
            navigation: {
              state: {
                params: {
                  person: person,
                  organization: organization,
                },
              },
            },
          },
        ),
      ).toMatchSnapshot();
    });
  });

  it('renders unassign correctly', () => {
    const component = testSnapshotShallow(
      <PersonSideMenu
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
      <PersonSideMenu
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
