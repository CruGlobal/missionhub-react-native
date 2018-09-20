import 'react-native';
import React from 'react';

import {
  PeopleScreen,
  mapStateToProps,
} from '../../src/containers/PeopleScreen';
import { testSnapshotShallow, renderShallow } from '../../testUtils';
import { peopleByOrgSelector } from '../../src/selectors/people';
import * as common from '../../src/utils/common';
import { navToPersonScreen } from '../../src/actions/person';

jest.mock('../../src/actions/person');
jest.mock('../../src/selectors/people');

jest.mock('../../src/actions/people', () => ({
  getMyPeople: jest.fn(),
}));

const orgs = [
  {
    id: 'personal',
    type: 'organization',
    people: [
      {
        id: 1,
        type: 'person',
      },
      {
        id: 2,
        type: 'person',
      },
      {
        id: 3,
        type: 'person',
      },
    ],
  },
  {
    id: 10,
    name: 'org 1',
    type: 'organization',
    people: [
      {
        id: 11,
        type: 'person',
      },
    ],
  },
  {
    id: 20,
    name: 'org 2',
    type: 'organization',
    people: [
      {
        id: 21,
        type: 'person',
      },
    ],
  },
];

const props = {
  isJean: true,
  orgs: orgs,
  dispatch: jest.fn(response => Promise.resolve(response)),
};

jest.mock('react-native-device-info');

describe('PeopleScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      peopleByOrgSelector.mockReturnValue(orgs);
      expect(
        mapStateToProps({
          auth: {
            isJean: true,
          },
          people: {},
        }),
      ).toMatchSnapshot();
    });
  });
  it('renders correctly as Casey', () => {
    testSnapshotShallow(<PeopleScreen {...props} isJean={false} />);
  });

  it('renders correctly as Jean', () => {
    testSnapshotShallow(<PeopleScreen {...props} isJean={true} />);
  });
  it('should open main menu', () => {
    const instance = renderShallow(<PeopleScreen {...props} />).instance();
    common.openMainMenu = jest.fn();
    instance.openMainMenu();
    expect(common.openMainMenu).toHaveBeenCalled();
  });

  describe('handleRowSelect', () => {
    it('should navigate to person screen in personal ministry', () => {
      const org = orgs[0];
      const person = org.people[0];
      const screen = renderShallow(<PeopleScreen {...props} />);
      screen
        .childAt(1)
        .props()
        .onSelect(person, org);

      expect(navToPersonScreen).toHaveBeenCalledWith(person, undefined);
    });

    it('should navigate to person screen in org', () => {
      const org = orgs[1];
      const person = org.people[0];
      const screen = renderShallow(<PeopleScreen {...props} />);
      screen
        .childAt(1)
        .props()
        .onSelect(person, org);

      expect(navToPersonScreen).toHaveBeenCalledWith(person, org);
    });
  });
});
