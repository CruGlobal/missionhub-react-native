import 'react-native';
import React from 'react';

import CardTime from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const date = '2017-10-09T13:51:49.888';

it('renders correctly', () => {
  testSnapshotShallow(<CardTime date={date} />);
});
