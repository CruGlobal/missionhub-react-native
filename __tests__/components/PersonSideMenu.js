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
import { deleteContactAssignment } from '../../src/actions/person';
import { assignContactAndPickStage } from '../../src/actions/misc';

jest.mock('../../src/actions/navigation');
jest.mock('../../src/actions/person');
jest.mock('../../src/actions/steps');
jest.mock('../../src/selectors/people');
jest.mock('../../src/actions/misc');

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

beforeEach(() => jest.clearAllMocks());

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

  describe('componentWillUnmount', () => {
    beforeEach(() =>
      deleteContactAssignment.mockImplementation(response =>
        Promise.resolve(response),
      ));

    it('should delete person if deleteOnUnmount is set', async () => {
      contactAssignmentSelector.mockReturnValue(contactAssignment);
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
  expect(assignContactAndPickStage).toHaveBeenCalledWith(
    person.id,
    organization.id,
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
