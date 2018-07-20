import React from 'react';

import EmptyCelebrateFeed from '../../src/components/EmptyCelebrateFeed';
import { testSnapshotShallow } from '../../testUtils';

const person = {
  first_name: 'Roge',
};

const personEndingInS = {
  first_name: 'Roges',
};

describe('Empty Celebrate Feed rendering', () => {
  it('renders correctly for member feed', () => {
    testSnapshotShallow(<EmptyCelebrateFeed person={person} />);
  });

  it('renders correctly for member feed ending in s', () => {
    testSnapshotShallow(<EmptyCelebrateFeed person={personEndingInS} />);
  });

  it('renders correctly for group feed', () => {
    testSnapshotShallow(<EmptyCelebrateFeed />);
  });
});
