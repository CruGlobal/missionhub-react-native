import React from 'react';
import { DrawerActions } from 'react-navigation';

import {
  PersonScreen,
  mapStateToProps,
  CONTACT_PERSON_TABS,
  IS_GROUPS_MEMBER_PERSON_TABS,
} from '../index';
import { renderShallow, testSnapshotShallow } from '../../../../../testUtils';
import { PERSON_MENU_DRAWER } from '../../../../constants';
import { contactAssignmentSelector } from '../../../../selectors/people';
import { organizationSelector } from '../../../../selectors/organizations';

jest.mock('../../../../selectors/people');
jest.mock('../../../../selectors/organizations');
jest.mock('../../../../actions/navigation', () => ({
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

beforeEach(() => {
  contactAssignmentSelector.mockReturnValue(contactAssignment);
});

describe('Contact', () => {
  it('should provide necessary props', () => {
    organizationSelector.mockReturnValue(undefined);

    expect(mapStateToProps(store, nav)).toEqual({
      organization: {},
      person,
      contactAssignment,
      myId,
      stages,
      myStageId: pathwayStage.id,
    });
  });

  it('should render PersonScreen correctly without stage', () => {
    testSnapshotShallow(
      <PersonScreen
        organization={organization}
        person={person}
        dispatch={jest.fn()}
        myId={myId}
        stages={stages}
      />,
    );
  });

  it('should render PersonScreen correctly with stage', () => {
    testSnapshotShallow(
      <PersonScreen
        organization={organization}
        person={person}
        dispatch={jest.fn()}
        myId={myId}
        stages={stages}
        pathwayStage={{ name: 'stage 4' }}
      />,
    );
  });

  it('should render contact tabs correctly', () => {
    expect(CONTACT_PERSON_TABS).toMatchSnapshot();
  });

  it('should render member tabs correctly', () => {
    expect(IS_GROUPS_MEMBER_PERSON_TABS).toMatchSnapshot();
  });

  it('opens side menu when menu button is pressed', () => {
    const component = renderShallow(
      <PersonScreen
        dispatch={dispatch}
        organization={organization}
        person={person}
        myId={myId}
        stages={stages}
      />,
    );
    component
      .find('Connect(Header)')
      .props()
      .right.props.onPress();

    expect(DrawerActions.openDrawer).toHaveBeenCalledWith({
      drawer: PERSON_MENU_DRAWER,
    });
  });
});
