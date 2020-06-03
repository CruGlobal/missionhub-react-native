import React from 'react';
import { DrawerActions } from 'react-navigation-drawer';
// @ts-ignore
import { shallow } from 'enzyme/build/index';

import { renderShallow, testSnapshotShallow } from '../../../../../testUtils';
import { PERSON_MENU_DRAWER } from '../../../../constants';
import { contactAssignmentSelector } from '../../../../selectors/people';
import { organizationSelector } from '../../../../selectors/organizations';
import * as common from '../../../../utils/common';

import {
  AssignedPersonScreen,
  mapStateToProps,
  CONTACT_PERSON_TABS,
  IS_USER_CREATED_MEMBER_PERSON_TABS,
  IS_GROUPS_MEMBER_PERSON_TABS,
} from '..';

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

const dispatch = jest.fn(response => Promise.resolve(response));
// @ts-ignore
DrawerActions.openDrawer = jest.fn();

const pathwayStage = { id: '3', name: 'stage 3' };
const contactAssignment = {
  id: 'assignment1',
  pathway_stage_id: pathwayStage.id,
};
const myId = '1000';
const stages = [pathwayStage];

const store = {
  people: {
    people: {
      [person.id]: person,
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
  // @ts-ignore
  contactAssignmentSelector.mockReturnValue(contactAssignment);
});

describe('Contact', () => {
  it('should provide necessary props', () => {
    // @ts-ignore
    organizationSelector.mockReturnValue(undefined);
    // @ts-ignore
    common.orgIsCru.mockReturnValue(true);

    // @ts-ignore
    expect(mapStateToProps(store, nav)).toEqual({
      organization,
      person,
      contactAssignment,
      myId,
      stages,
      myStageId: pathwayStage.id,
      isCruOrg: true,
    });
    expect(common.orgIsCru).toHaveBeenCalledWith(organization);
  });

  it('should render AssignedPersonScreen correctly without stage', () => {
    testSnapshotShallow(<AssignedPersonScreen {...props} />);
  });

  it('should render AssignedPersonScreen correctly with stage for cru community', () => {
    testSnapshotShallow(
      // @ts-ignore
      <AssignedPersonScreen {...props} pathwayStage={{ name: 'stage 4' }} />,
    );
  });

  it('should render AssignedPersonScreen correctly with stage for User-Created Community', () => {
    testSnapshotShallow(
      <AssignedPersonScreen
        {...props}
        // @ts-ignore
        pathwayStage={{ name: 'stage 4' }}
        isCruOrg={false}
      />,
    );
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
    const component = renderShallow(
      // @ts-ignore
      <AssignedPersonScreen {...props} dispatch={dispatch} />,
    );
    component
      .find('Header')
      .props()
      // @ts-ignore
      .right.props.onPress();

    expect(DrawerActions.openDrawer).toHaveBeenCalledWith({
      drawer: PERSON_MENU_DRAWER,
    });
  });

  it('hides the header when the keyboard is shown', () => {
    const component = shallow(<AssignedPersonScreen {...props} />);

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
