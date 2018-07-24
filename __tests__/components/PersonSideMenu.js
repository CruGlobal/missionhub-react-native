import React from 'react';

import PersonSideMenu from '../../src/components/PersonSideMenu';
import {
  renderShallow,
  createMockStore,
  createMockNavState,
} from '../../testUtils';
import { ADD_CONTACT_SCREEN } from '../../src/containers/AddContactScreen';
import { STATUS_REASON_SCREEN } from '../../src/containers/StatusReasonScreen';
import { navigatePush, navigateBack } from '../../src/actions/navigation';
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
    isJean: true,
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

orgPermissionSelector.mockReturnValue(orgPermission);
personSelector.mockReturnValue(person);

beforeEach(() => {
  navigatePush.mockClear();
  navigateBack.mockClear();
  createContactAssignment.mockClear();
  contactAssignmentSelector.mockClear();
});

let component;

const createComponent = () => {
  component = renderShallow(
    <PersonSideMenu
      navigation={createMockNavState({
        person,
        organization,
      })}
    />,
    store,
  );
};

describe('PersonSideMenu', () => {
  it('renders unassign correctly', () => {
    contactAssignmentSelector.mockReturnValue(contactAssignment);
    createComponent();

    expect(component).toMatchSnapshot();
    testEditClick(true);
    navigatePush.mockClear();
    testUnassignClick();
  });
  it('renders assign correctly', () => {
    contactAssignmentSelector.mockReturnValue(undefined);
    createComponent();

    expect(component).toMatchSnapshot();
    testEditClick(true);
    testAssignClick();
  });

  it('should navigate back 2 on submit reason', () => {
    createComponent();
    const instance = component.instance();
    instance.onSubmitReason();
    expect(navigateBack).toHaveBeenCalledWith(2);
  });
});

function testEditClick(isJean) {
  const props = component.props();
  props.menuItems.filter(item => item.label === 'Edit')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
    isJean: isJean,
    person: person,
    onComplete: expect.any(Function),
  });
}

function testAssignClick() {
  const props = component.props();
  props.menuItems.filter(item => item.label === 'Assign')[0].action();
  expect(createContactAssignment).toHaveBeenCalledWith(
    organization.id,
    me.id,
    person.id,
  );
}

function testUnassignClick() {
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
