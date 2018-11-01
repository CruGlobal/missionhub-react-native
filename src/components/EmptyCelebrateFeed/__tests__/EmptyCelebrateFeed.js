import React from 'react';

import EmptyCelebrateFeed from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const person = {
  first_name: 'Roge',
};

const personEndingInS = {
  first_name: 'Roges',
};

const props = {
  refreshing: false,
  refreshCallback: jest.fn(),
};

describe('Empty Celebrate Feed rendering', () => {
  it('renders correctly for member feed', () => {
    testSnapshotShallow(<EmptyCelebrateFeed {...props} person={person} />);
  });

  it('renders correctly for member feed ending in s', () => {
    testSnapshotShallow(
      <EmptyCelebrateFeed {...props} person={personEndingInS} />,
    );
  });

  it('renders correctly for group feed', () => {
    testSnapshotShallow(<EmptyCelebrateFeed {...props} />);
  });
});
