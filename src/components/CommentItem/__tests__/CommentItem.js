import 'react-native';
import React from 'react';

import CommentItem from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const item = {
  content: 'hello roge',
  created_at: '2018-06-11 12:00:00 UTC',
  person: { first_name: 'Roge', last_name: 'Goers' },
};

it('renders correctly', () => {
  testSnapshotShallow(<CommentItem item={item} />);
});
