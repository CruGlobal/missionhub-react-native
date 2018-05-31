import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import Card from '../../src/components/Card';

it('render load more button', () => {
  testSnapshotShallow(<Card />);
});
