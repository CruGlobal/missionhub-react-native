import 'react-native';
import React from 'react';

import { PeopleScreen, mapStateToProps } from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import {
  peopleByOrgSelector,
  allAssignedPeopleSelector,
} from '../../../selectors/people';
import * as common from '../../../utils/common';
import { navToPersonScreen } from '../../../actions/person';

jest.mock('../../../actions/person');
jest.mock('../../../selectors/people');

jest.mock('../../../actions/people', () => ({
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

const people = [
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
];

const props = {
  isJean: true,
  items: orgs,
  dispatch: jest.fn(response => Promise.resolve(response)),
};

jest.mock('react-native-device-info');

describe('PeopleScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props for Jean', () => {
      peopleByOrgSelector.mockReturnValue(orgs);
      expect(
        mapStateToProps({
          auth: {
            isJean: true,
          },
          people: {},
        }),
      ).toMatchSnapshot();
      expect(peopleByOrgSelector).toHaveBeenCalled();
    });
    it('should provide the necessary props for Jean with no contacts', () => {
      peopleByOrgSelector.mockReturnValue([
        {
          id: 'personal',
          type: 'organization',
          people: [
            {
              id: 'me person',
            },
          ],
        },
      ]);
      expect(
        mapStateToProps({
          auth: {
            isJean: true,
          },
          people: {},
        }),
      ).toMatchSnapshot();
      expect(peopleByOrgSelector).toHaveBeenCalled();
    });
    it('should provide the necessary props for Casey', () => {
      allAssignedPeopleSelector.mockReturnValue(people);
      expect(
        mapStateToProps({
          auth: {
            isJean: false,
          },
          people: {},
        }),
      ).toMatchSnapshot();
      expect(allAssignedPeopleSelector).toHaveBeenCalled();
    });
    it('should provide necessary props for Casey with no steps', () => {
      allAssignedPeopleSelector.mockReturnValue([{ id: 'me person' }]);
      expect(
        mapStateToProps({
          auth: {
            isJean: false,
          },
          people: {},
        }),
      ).toMatchSnapshot();
      expect(allAssignedPeopleSelector).toHaveBeenCalled();
    });
  });

  it('renders empty correctly', () => {
    testSnapshotShallow(
      <PeopleScreen
        {...props}
        isJean={false}
        items={[{ id: 'me person' }]}
        hasNoContacts={true}
      />,
    );
  });

  it('renders correctly as Casey', () => {
    testSnapshotShallow(
      <PeopleScreen {...props} isJean={false} items={people} />,
    );
  });

  it('renders correctly as Jean', () => {
    testSnapshotShallow(<PeopleScreen {...props} isJean={true} items={orgs} />);
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
