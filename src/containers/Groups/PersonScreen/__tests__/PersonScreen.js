import React from 'react';
import { DrawerActions } from 'react-navigation';

import {
  PersonScreen,
  mapStateToProps,
  CONTACT_PERSON_TABS,
  MEMBER_PERSON_TABS,
} from '../PersonScreen';
import { renderShallow, testSnapshotShallow } from '../../../../../testUtils';
import { PERSON_MENU_DRAWER } from '../../../../constants';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
}));

const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', full_name: 'Test Person' };
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
};

describe('Contact', () => {
  it('should provide necessary props', () => {
    expect(mapStateToProps(store, nav)).toEqual({ organization, person });
  });

  it('should render PersonScreen correctly', () => {
    testSnapshotShallow(
      <PersonScreen organization={organization} person={person} />,
    );
  });

  it('should render contact tabs correctly', () => {
    expect(CONTACT_PERSON_TABS).toMatchSnapshot();
  });

  it('should render member tabs correctly', () => {
    expect(MEMBER_PERSON_TABS).toMatchSnapshot();
  });

  it('opens side menu when menu button is pressed', () => {
    const component = renderShallow(
      <PersonScreen
        dispatch={dispatch}
        organization={organization}
        person={person}
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
