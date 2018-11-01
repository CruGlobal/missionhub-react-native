import React from 'react';

import EmptyChallengeFeed from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const props = {
  refreshing: false,
  refreshCallback: jest.fn(),
};

describe('Empty Challenge Feed rendering', () => {
  it('renders correctly for challenge feed', () => {
    testSnapshotShallow(<EmptyChallengeFeed {...props} />);
  });
});
