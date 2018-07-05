import React from 'react';

import {
  PersonSideMenu,
  mapStateToProps,
} from '../../src/components/PersonSideMenu';
import { testSnapshotShallow } from '../../testUtils';
import { ADD_CONTACT_SCREEN } from '../../src/containers/AddContactScreen';
import { STATUS_REASON_SCREEN } from '../../src/containers/StatusReasonScreen';
import { navigatePush } from '../../src/actions/navigation';
import {
  personSelector,
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../../src/selectors/people';
import { createContactAssignment } from '../../src/actions/person';
jest.mock('../../src/actions/navigation');
jest.mock('../../src/actions/person');
jest.mock('../../src/actions/steps');
jest.mock('../../src/selectors/people');

const dispatch = jest.fn(response => Promise.resolve(response));
const me = { id: 1 };
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
  navigatePush.mockClear();
  createContactAssignment.mockClear();
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
        organization={organization}
      />,
    );

    testEditClick(component, true);
    navigatePush.mockClear();
    testUnassignClick(component);
  });
  it('renders assign correctly', () => {
    const component = testSnapshotShallow(
      <PersonSideMenu
        dispatch={dispatch}
        isJean={true}
        myId={me.id}
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
    me.id,
    person.id,
  );
}

function testUnassignClick(component, deleteMode = false) {
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
