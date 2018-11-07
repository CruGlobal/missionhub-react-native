import React from 'react';
import { Share, Linking } from 'react-native';

import MemberOptionsMenu from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const props = {
  survey: { id: '1', title: 'test' },
};

describe('MemberOptionsMenu', () => {
  it('renders member options menu', () => {
    testSnapshotShallow(<MemberOptionsMenu {...props} />);
  });
});
