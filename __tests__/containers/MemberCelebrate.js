import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MemberCelebrate from '../../src/containers/MemberCelebrate';
import { testSnapshotShallow } from '../../testUtils';

const mockEmptyState = {
  organizations: {
    all: [
      {
        id: '123',
        celebrateItems: [],
        celebratePagination: {
          hasNextPage: true,
          page: 0,
        },
      },
    ],
  },
};

const mockState = {
  organizations: {
    all: [
      {
        id: '456',
        celebrateItems: [
          {
            id: '10',
            celebrateable_type: 'interaction',
            adjective_attribute_value: 4,
            changed_attribute_value: '2018-06-11 00:00:00 UTC',
            subject_person: { id: '1' },
          },
        ],
        celebratePagination: {
          hasNextPage: true,
          page: 0,
        },
      },
    ],
  },
};

const mockStore = configureStore([thunk]);

const emptyStore = mockStore(mockEmptyState);
const store = mockStore(mockState);

describe('MemberCelebrate', () => {
  it('renders empty feed correctly', () => {
    const person = { id: '1' };
    const organization = { id: '123' };
    testSnapshotShallow(
      <MemberCelebrate
        store={emptyStore}
        person={person}
        organization={organization}
      />,
    );
  });

  it('renders correctly', () => {
    const person = { id: '1' };
    const organization = { id: '456' };
    testSnapshotShallow(
      <MemberCelebrate
        store={store}
        person={person}
        organization={organization}
      />,
    );
  });
});
