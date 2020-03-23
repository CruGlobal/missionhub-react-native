import React from 'react';
import { DrawerActions } from 'react-navigation-drawer';
import { useDispatch } from 'react-redux';
// @ts-ignore
import { shallow } from 'enzyme/build/index';

import { renderWithContext } from '../../../../../testUtils';
import { PERSON_MENU_DRAWER } from '../../../../constants';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../../../../selectors/people';
import * as common from '../../../../utils/common';

import {
  connectedPersonScreen as AssignedPersonScreen,
  CONTACT_PERSON_TABS,
  IS_USER_CREATED_MEMBER_PERSON_TABS,
  IS_GROUPS_MEMBER_PERSON_TABS,
} from '..';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));
jest.mock('../../../../selectors/people');
jest.mock('../../../../selectors/organizations');
jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../../utils/common');

const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', first_name: 'Test Person' };
const nav = {
  navigation: {
    state: {
      params: {
        organization,
        person,
      },
    },
  },
};

// @ts-ignore
DrawerActions.openDrawer = jest.fn();

const pathwayStage = { id: '3', name: 'stage 3' };
const contactAssignment = {
  id: 'assignment1',
  pathway_stage_id: pathwayStage.id,
};
const orgPermission = {
  id: 'orgPermission1',
};
const myId = '1000';
const stages = [pathwayStage];

const initialState = {
  people: {
    allByOrg: {
      [organization.id]: {
        people: {
          [person.id]: person,
        },
      },
    },
  },
  auth: {
    person: {
      id: myId,
      user: { pathway_stage_id: contactAssignment.pathway_stage_id },
    },
  },
  stages: {
    stages,
  },
};

const props = {
  organization: organization,
  person: person,
  dispatch: jest.fn(),
  myId: myId,
  stages: stages,
  isMember: true,
  isCruOrg: true,
};

beforeEach(() => {
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
    contactAssignment,
  );
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    orgPermission,
  );
});

describe('Contact', () => {
  it('should render AssignedPersonScreen correctly without stage', () => {
    renderWithContext(<AssignedPersonScreen />, {
      initialState,
      navParams: {
        person,
        organization,
      },
    }).snapshot();
  });

  it('should render AssignedPersonScreen correctly with stage for User-Created Community', () => {
    renderWithContext(<AssignedPersonScreen />, {
      initialState,
      navParams: {
        person,
        organization: { ...organization, userCreated: true },
      },
    });
  });

  it('should render contact tabs correctly', () => {
    expect(CONTACT_PERSON_TABS).toMatchSnapshot();
  });

  it('should render user created member tabs correctly', () => {
    expect(IS_USER_CREATED_MEMBER_PERSON_TABS).toMatchSnapshot();
  });

  it('should render group member tabs correctly', () => {
    expect(IS_GROUPS_MEMBER_PERSON_TABS).toMatchSnapshot();
  });

  it('opens side menu when menu button is pressed', () => {
    const { getByTestId } = renderWithContext(<AssignedPersonScreen />, {
      initialState,
      navParams: {
        person,
        organization,
      },
    });

    getByTestId('Header').props.right.props.onPress();

    expect(DrawerActions.openDrawer).toHaveBeenCalledWith({
      drawer: PERSON_MENU_DRAWER,
    });
  });

  it('hides the header when the keyboard is shown', () => {
    const { component } = shallow(<AssignedPersonScreen {...props} />);

    component.setState({ keyboardVisible: true });
    expect(component).toMatchSnapshot();
  });

  it('sets the keyboard to visible', () => {
    const component = shallow(<AssignedPersonScreen {...props} />);
    const instance = component.instance();
    instance.keyboardShow();
    expect(instance.state).toEqual({ keyboardVisible: true });
  });

  it('sets the keyboard to not visible', () => {
    const component = shallow(<AssignedPersonScreen {...props} />);
    const instance = component.instance();
    instance.keyboardShow();
    instance.keyboardHide();
    expect(instance.state).toEqual({ keyboardVisible: false });
  });

  it('mounts and sets the keyboard listeners', () => {
    const mockShowListener = 'show';
    const mockHideListener = 'hide';
    // @ts-ignore
    common.keyboardShow = jest.fn(() => mockShowListener);
    // @ts-ignore
    common.keyboardHide = jest.fn(() => mockHideListener);
    const component = shallow(<AssignedPersonScreen {...props} />);
    const instance = component.instance();
    expect(instance.keyboardShowListener).toEqual(mockShowListener);
    expect(instance.keyboardHideListener).toEqual(mockHideListener);
  });

  it('unmounts and runs the keyboard listeners', () => {
    const mockShowListener = jest.fn();
    const mockHideListener = jest.fn();
    // @ts-ignore
    common.keyboardShow = jest.fn(() => ({ remove: mockShowListener }));
    // @ts-ignore
    common.keyboardHide = jest.fn(() => ({ remove: mockHideListener }));
    const component = shallow(<AssignedPersonScreen {...props} />);
    component.unmount();
    expect(mockShowListener).toHaveBeenCalled();
    expect(mockHideListener).toHaveBeenCalled();
  });
});
