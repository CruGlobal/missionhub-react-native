import React from 'react';
import { DrawerActions } from 'react-navigation';
import { shallow } from 'enzyme/build/index';

import {
  AssignedPersonScreen,
  mapStateToProps,
  CONTACT_PERSON_TABS,
  IS_COHORT_MEMBER_PERSON_TABS,
  IS_GROUPS_MEMBER_PERSON_TABS,
} from '../../../../src/containers/Groups/AssignedPersonScreen';
import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { PERSON_MENU_DRAWER } from '../../../../src/constants';
import { contactAssignmentSelector } from '../../../../src/selectors/people';
import { organizationSelector } from '../../../../src/selectors/organizations';
import * as common from '../../../../src/utils/common';

jest.mock('../../../../src/selectors/people');
jest.mock('../../../../src/selectors/organizations');
jest.mock('../../../../src/actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
}));

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
};

beforeEach(() => {
  contactAssignmentSelector.mockReturnValue(contactAssignment);
});

describe('Contact', () => {
  it('should provide necessary props', () => {
    organizationSelector.mockReturnValue(undefined);

    expect(mapStateToProps(store, nav)).toEqual({
      organization,
      person,
      contactAssignment,
      myId,
      stages,
      myStageId: pathwayStage.id,
    });
  });

  it('should render AssignedPersonScreen correctly without stage', () => {
    testSnapshotShallow(<AssignedPersonScreen {...props} />);
  });

  it('should render AssignedPersonScreen correctly with stage', () => {
    testSnapshotShallow(
      <AssignedPersonScreen {...props} pathwayStage={{ name: 'stage 4' }} />,
    );
  });

  it('should render contact tabs correctly', () => {
    expect(CONTACT_PERSON_TABS).toMatchSnapshot();
  });

  it('should render cohort member tabs correctly', () => {
    expect(IS_COHORT_MEMBER_PERSON_TABS).toMatchSnapshot();
  });

  it('should render group member tabs correctly', () => {
    expect(IS_GROUPS_MEMBER_PERSON_TABS).toMatchSnapshot();
  });

  it('opens side menu when menu button is pressed', () => {
    const component = renderShallow(
      <AssignedPersonScreen {...props} dispatch={dispatch} />,
    );
    component
      .find('Connect(Header)')
      .props()
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
    common.keyboardShow = jest.fn(() => mockShowListener);
    common.keyboardHide = jest.fn(() => mockHideListener);
    const component = shallow(<AssignedPersonScreen {...props} />);
    const instance = component.instance();
    expect(instance.keyboardShowListener).toEqual(mockShowListener);
    expect(instance.keyboardHideListener).toEqual(mockHideListener);
  });

  it('unmounts and runs the keyboard listeners', () => {
    const mockShowListener = jest.fn();
    const mockHideListener = jest.fn();
    common.keyboardShow = jest.fn(() => ({ remove: mockShowListener }));
    common.keyboardHide = jest.fn(() => ({ remove: mockHideListener }));
    const component = shallow(<AssignedPersonScreen {...props} />);
    const instance = component.instance();
    instance.componentWillUnmount();
    expect(mockShowListener).toHaveBeenCalled();
    expect(mockHideListener).toHaveBeenCalled();
  });
});
