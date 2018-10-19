import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import Dot from '../../src/components/Dot';

it('render dot', () => {
  testSnapshotShallow(<Dot />);
});

it('render dot with style', () => {
  testSnapshotShallow(<Dot style={{ color: 'blue' }} />);
});
