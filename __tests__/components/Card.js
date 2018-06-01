import React from 'react';

import Card from '../../src/components/Card';
import { testSnapshotShallow } from '../../testUtils';

describe('Card', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<Card />);
  });
});
