import 'react-native';
import React from 'react';

import ItemHeaderText from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const text = 'Roge Goers';

it('renders correctly', () => {
  testSnapshotShallow(<ItemHeaderText text={text} style={{ fontSize: 12 }} />);
});
