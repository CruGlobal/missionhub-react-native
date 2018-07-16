import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MemberCelebrate from '../../src/containers/MemberCelebrate';
import { testSnapshotShallow } from '../../testUtils';

const mockState = {
  organizations: {
    all: [
      {
        id: '123',
        celebrateItems: [],
      },
    ],
    celebratePagination: {
      hasNextPage: true,
      page: 0,
    },
  },
};

const mockStore = configureStore([thunk]);

let store = mockStore(mockState);

describe('MemberCelebrate', () => {
  it('renders correctly', () => {
    const person = { id: '1' };
    const organization = { id: '123' };
    testSnapshotShallow(
      <MemberCelebrate
        store={store}
        person={person}
        organization={organization}
      />,
    );
  });
});
