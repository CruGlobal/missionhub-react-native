import React from 'react';
import { Alert } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import { EDIT_PERSON_FLOW } from '../../../routes/constants';
import { STATUS_REASON_SCREEN } from '../../../containers/StatusReasonScreen';
import { MenuItemsType } from '../../../components/SideMenu';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import {
  personSelector,
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../../../selectors/people';
import { deleteContactAssignment } from '../../../actions/person';
import { assignContactAndPickStage } from '../../../actions/misc';

import PersonSideMenu from '..';

jest.mock('react-redux');
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

const initialState = {
  auth: { person: me },
  people: {
    allByOrg: {
      [organization.id]: {
        people: {
          [person.id]: person,
        },
      },
    },
  },
};

beforeEach(() => {
  ((personSelector as unknown) as jest.Mock).mockReturnValue(person);
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigated back' });
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigated push' });
  (assignContactAndPickStage as jest.Mock).mockReturnValue({
    type: 'assigned contact and picked stage',
  });
});

describe('PersonSideMenu', () => {
  describe('person has org permission', () => {
    beforeEach(() =>
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
        orgPermission,
      ),
    );

    describe('unassign', () => {
      beforeEach(() => {
        ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
          contactAssignment,
        );
      });

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
      beforeEach(() => {
        ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
          undefined,
        );
      });

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

      it('assign button works', () => {
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
        menuItems.filter(item => item.label === 'Assign')[0].action();
        expect(assignContactAndPickStage).toHaveBeenCalledWith(
          person,
          organization,
          me.id,
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
    beforeEach(() => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(null);
      ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
        contactAssignment,
      );
    });

    it('renders delete correctly', () => {
      renderWithContext(<PersonSideMenu />, {
        initialState,
        navParams: { person },
      }).snapshot();
    });

    it('should delete on unmount when person confirms delete', () => {
      Alert.alert = jest.fn();

      const { getByTestId, unmount } = renderWithContext(<PersonSideMenu />, {
        initialState,
        navParams: { person },
      });

      const { menuItems } = getByTestId('SideMenu').props as {
        menuItems: MenuItemsType[];
      };
      menuItems.filter(item => item.label === 'Delete Person')[0].action();

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      //Manually call onPress
      (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
      expect(navigateBack).toHaveBeenCalledWith(2);

      unmount();

      expect(deleteContactAssignment).toHaveBeenCalledWith(
        contactAssignment.id,
        person.id,
        organization.id,
      );
    });
  });
});
