import React from 'react';
import { Alert } from 'react-native';

import {
  renderShallow,
  createThunkStore,
  createMockNavState,
  testSnapshotShallow,
} from '../../../../testUtils';
import { EDIT_PERSON_FLOW } from '../../../routes/constants';
import { STATUS_REASON_SCREEN } from '../../../containers/StatusReasonScreen';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import {
  personSelector,
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../../../selectors/people';
import { deleteContactAssignment } from '../../../actions/person';
import { assignContactAndPickStage } from '../../../actions/misc';

import PersonSideMenu from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../actions/steps');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/misc');
jest.mock('react-navigation-drawer', () => ({
  DrawerActions: {
    closeDrawer: jest.fn(),
  },
}));
jest.mock('react-navigation-tabs', () => ({
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

const store = createThunkStore({
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

// @ts-ignore
personSelector.mockReturnValue(person);
// @ts-ignore
navigateBack.mockReturnValue({ type: 'navigated back' });
// @ts-ignore
navigatePush.mockReturnValue({ type: 'navigated push' });
// @ts-ignore
assignContactAndPickStage.mockReturnValue({
  type: 'assigned contact and picked stage',
});

// @ts-ignore
let component;

const createComponent = (extraProps = {}) => {
  component = renderShallow(
    <PersonSideMenu
      navigation={createMockNavState({
        person,
        organization,
        ...extraProps,
      })}
    />,
    store,
  );
};

describe('PersonSideMenu', () => {
  describe('person has org permission', () => {
    // @ts-ignore
    beforeEach(() => orgPermissionSelector.mockReturnValue(orgPermission));

    describe('unassign', () => {
      it('renders correctly', () => {
        // @ts-ignore
        contactAssignmentSelector.mockReturnValue(contactAssignment);
        createComponent();

        // @ts-ignore
        expect(component).toMatchSnapshot();
      });

      it('edit button works', () => {
        // @ts-ignore
        testEditClick(component);
      });

      it('unassign button works', () => {
        // @ts-ignore
        testUnassignClick(component);
      });
    });

    it('renders assign correctly', () => {
      // @ts-ignore
      contactAssignmentSelector.mockReturnValue(undefined);
      createComponent();

      // @ts-ignore
      expect(component).toMatchSnapshot();
      // @ts-ignore
      testEditClick(component);
      // @ts-ignore
      testAssignClick(component);
    });

    it('renders user-created correctly', () => {
      const newOrg = { ...organization, user_created: true };
      createComponent({ organization: newOrg });

      // @ts-ignore
      expect(component).toMatchSnapshot();
    });

    it('should navigate back 2 on submit reason', () => {
      createComponent();
      // @ts-ignore
      const instance = component.instance();
      instance.onSubmitReason();
      expect(navigateBack).toHaveBeenCalledWith(2);
    });
  });

  describe('person does not have org permission', () => {
    // @ts-ignore
    beforeEach(() => orgPermissionSelector.mockReturnValue(null));

    it('renders delete correctly', () => {
      // @ts-ignore
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
      // @ts-ignore
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

      // @ts-ignore
      props.menuItems.find(item => item.label === 'Delete Person').action();

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      //Manually call onPress
      // @ts-ignore
      Alert.alert.mock.calls[0][2][1].onPress();
      // @ts-ignore
      expect(component.instance().deleteOnUnmount).toEqual(true);
      expect(navigateBack).toHaveBeenCalledWith(2);
    });

    describe('componentWillUnmount', () => {
      beforeEach(() =>
        // @ts-ignore
        deleteContactAssignment.mockImplementation(response => () =>
          Promise.resolve(response),
        ),
      );

      it('should delete person if deleteOnUnmount is set', async () => {
        createComponent();
        // @ts-ignore
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
        // @ts-ignore
        contactAssignmentSelector.mockReturnValue(contactAssignment);
        createComponent();
        // @ts-ignore
        const instance = component.instance();

        await instance.componentWillUnmount();

        expect(deleteContactAssignment).not.toHaveBeenCalled();
      });
    });
  });
});

// @ts-ignore
function testEditClick(component, org = organization) {
  const props = component.props();
  // @ts-ignore
  props.menuItems.filter(item => item.label === 'Edit')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(EDIT_PERSON_FLOW, {
    person,
    organization: org,
  });
}

// @ts-ignore
function testAssignClick(component) {
  const props = component.props();
  // @ts-ignore
  props.menuItems.filter(item => item.label === 'Assign')[0].action();
  expect(assignContactAndPickStage).toHaveBeenCalledWith(
    person,
    organization,
    me.id,
  );
}

// @ts-ignore
function testUnassignClick(component) {
  const props = component.props();
  const onSubmit = component.instance().onSubmitReason;

  // @ts-ignore
  props.menuItems.filter(item => item.label === 'Unassign')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(STATUS_REASON_SCREEN, {
    person,
    organization,
    contactAssignment,
    onSubmit,
  });
}
