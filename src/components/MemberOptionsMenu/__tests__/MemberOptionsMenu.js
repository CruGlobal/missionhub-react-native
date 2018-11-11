import React from 'react';

import MemberOptionsMenu from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const props = {
  survey: { id: '1', title: 'test' },
};

describe('MemberOptionsMenu', () => {
  it('renders member options menu', () => {
    testSnapshotShallow(<MemberOptionsMenu {...props} />);
  });
});
