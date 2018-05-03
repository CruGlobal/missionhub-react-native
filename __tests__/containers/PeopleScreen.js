import 'react-native';
import React from 'react';

import { PeopleScreen, mapStateToProps } from '../../src/containers/PeopleScreen';
import { testSnapshotShallow } from '../../testUtils';
import { peopleByOrgSelector } from '../../src/selectors/people';
jest.mock('../../src/selectors/people');

jest.mock('../../src/actions/people', () => ({
  getMyPeople: () => { },
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
  dispatch: jest.fn((response) => Promise.resolve(response)),
};

jest.mock('react-native-device-info');

describe('PeopleScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      peopleByOrgSelector.mockReturnValue(orgs);
      expect(mapStateToProps(
        {
          auth: {
            isJean: true,
          },
          people: {},
        },
      )).toMatchSnapshot();
    });
  });
  it('renders correctly as Casey', () => {
    testSnapshotShallow(
      <PeopleScreen {...props} />
    );
  });

  it('renders correctly as Jean', () => {
    testSnapshotShallow(
      <PeopleScreen { ...props} isJean={true} />
    );
  });
});
