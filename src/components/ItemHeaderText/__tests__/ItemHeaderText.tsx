import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils';

import ItemHeaderText from '..';

const text = 'Roge Goers';

it('renders correctly', () => {
  testSnapshotShallow(<ItemHeaderText text={text} style={{ fontSize: 12 }} />);
});
