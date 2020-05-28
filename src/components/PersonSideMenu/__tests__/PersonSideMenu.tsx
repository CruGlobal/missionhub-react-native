import React from 'react';
import { Alert } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import { EDIT_PERSON_FLOW } from '../../../routes/constants';
import { STATUS_REASON_SCREEN } from '../../../containers/StatusReasonScreen';
import { MenuItemsType } from '../../../components/SideMenu';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { deleteContactAssignment } from '../../../actions/person';
import { assignContactAndPickStage } from '../../../actions/misc';

import { PersonSideMenu } from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../actions/steps');
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
const organization = { id: '4', type: 'organization' };
const orgPermission = {
  id: '5',
  organization_id: organization.id,
  type: 'organizational_permission',
  followup_status: 'uncontacted',
};
const contactAssignment = {
  id: '3',
  type: 'reverse_contact_assignment',
  assigned_to: me,
  organization,
};
const person = {
  id: '2',
  type: 'person',
  first_name: 'Test Fname',
  reverse_contact_assignments: [contactAssignment],
  organizational_permissions: [orgPermission],
};

const initialState = {
  auth: { person: me },
  drawer: { isOpen: true },
  people: {
    people: {
      [person.id]: person,
    },
  },
};

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigated back' });
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigated push' });
  (assignContactAndPickStage as jest.Mock).mockReturnValue({
    type: 'assigned contact and picked stage',
  });
  (deleteContactAssignment as jest.Mock).mockReturnValue({
    type: 'delete contact assignment',
  });
});

describe('PersonSideMenu', () => {
  describe('person has org permission', () => {
    describe('unassign', () => {
      it('renders correctly', () => {
        renderWithContext(<PersonSideMenu />, {
          initialState,
          navParams: {
            person,
            organization,
          },
        }).snapshot();
      });

      it('edit button works', () => {
        const { getByTestId } = renderWithContext(<PersonSideMenu />, {
          initialState,
          navParams: {
            person,
            organization,
          },
        });

        const { menuItems } = getByTestId('SideMenu').props as {
          menuItems: MenuItemsType[];
        };
        menuItems.filter(item => item.label === 'Edit')[0].action();
        expect(navigatePush).toHaveBeenCalledWith(EDIT_PERSON_FLOW, {
          person,
          organization,
        });
      });

      it('unassign button works', () => {
        const { getByTestId } = renderWithContext(<PersonSideMenu />, {
          initialState,
          navParams: {
            person,
            organization,
          },
        });

        const { menuItems } = getByTestId('SideMenu').props as {
          menuItems: MenuItemsType[];
        };
        menuItems.filter(item => item.label === 'Unassign')[0].action();
        expect(navigatePush).toHaveBeenCalledWith(STATUS_REASON_SCREEN, {
          person,
          organization,
          contactAssignment,
          onSubmit: expect.any(Function),
        });
      });

      it('should navigate back 2 on submit reason', () => {
        (navigatePush as jest.Mock).mockImplementation(
          (_, { onSubmit }: { onSubmit: () => void }) => onSubmit(),
        );

        const { getByTestId } = renderWithContext(<PersonSideMenu />, {
          initialState,
          navParams: {
            person,
            organization,
          },
        });

        const { menuItems } = getByTestId('SideMenu').props as {
          menuItems: MenuItemsType[];
        };
        menuItems.filter(item => item.label === 'Unassign')[0].action();
        expect(navigateBack).toHaveBeenCalledWith(2);
      });
    });

    describe('renders assign correctly', () => {
      const unassignedPerson = { ...person, reverse_contact_assignments: [] };

      it('renders correctly', () => {
        renderWithContext(<PersonSideMenu />, {
          initialState,
          navParams: {
            person: unassignedPerson,
            organization,
          },
        }).snapshot();
      });

      it('edit button works', () => {
        const { getByTestId } = renderWithContext(<PersonSideMenu />, {
          initialState,
          navParams: {
            person: unassignedPerson,
            organization,
          },
        });

        const { menuItems } = getByTestId('SideMenu').props as {
          menuItems: MenuItemsType[];
        };
        menuItems.filter(item => item.label === 'Edit')[0].action();
        expect(navigatePush).toHaveBeenCalledWith(EDIT_PERSON_FLOW, {
          person: unassignedPerson,
          organization,
        });
      });

      it('assign button works', () => {
        const { getByTestId } = renderWithContext(<PersonSideMenu />, {
          initialState,
          navParams: {
            person: unassignedPerson,
            organization,
          },
        });

        const { menuItems } = getByTestId('SideMenu').props as {
          menuItems: MenuItemsType[];
        };
        menuItems.filter(item => item.label === 'Assign')[0].action();
        expect(assignContactAndPickStage).toHaveBeenCalledWith(
          unassignedPerson,
          organization,
        );
      });
    });

    it('renders user-created correctly', () => {
      const newOrg = { ...organization, user_created: true };

      renderWithContext(<PersonSideMenu />, {
        initialState,
        navParams: {
          person,
          organization: newOrg,
        },
      }).snapshot();
    });
  });

  describe('person does not have org permission', () => {
    const personWithoutOrgPermission = {
      ...person,
      reverse_contact_assignments: [
        { ...contactAssignment, organization: undefined },
      ],
      organizational_permissions: [],
    };

    it('renders delete correctly', () => {
      renderWithContext(<PersonSideMenu />, {
        initialState,
        navParams: { person: personWithoutOrgPermission },
      }).snapshot();
    });

    it('should delete on unmount when person confirms delete', () => {
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(<PersonSideMenu />, {
        initialState,
        navParams: { person: personWithoutOrgPermission },
      });

      const { menuItems } = getByTestId('SideMenu').props as {
        menuItems: MenuItemsType[];
      };
      menuItems.filter(item => item.label === 'Delete Person')[0].action();

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      //Manually call onPress
      (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
      expect(navigateBack).toHaveBeenCalledWith(2);
      expect(deleteContactAssignment).toHaveBeenCalledWith(
        contactAssignment.id,
        person.id,
        undefined,
      );
    });
  });
});
