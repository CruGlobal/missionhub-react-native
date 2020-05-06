import React from 'react';
import MockDate from 'mockdate';

import { testSnapshotShallow } from '../../../../testUtils';

import CardTime from '..';

const date = '2017-10-09T13:51:49.888';
MockDate.set('2017-10-13 12:00:00', 300);

it('renders correctly', () => {
  testSnapshotShallow(<CardTime date={date} />);
});

it('renders correctly with comment formatting', () => {
  testSnapshotShallow(<CardTime date={date} commentFormatting={true} />);
});

it('renders correctly with custom styling', () => {
  testSnapshotShallow(<CardTime date={date} style={{ color: 'blue' }} />);
});
