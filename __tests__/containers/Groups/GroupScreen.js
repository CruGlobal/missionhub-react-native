import React from 'react';

import { GroupScreen } from '../../../src/containers/Groups/GroupScreen';
import { testSnapshotShallow, createMockNavState } from '../../../testUtils';

jest.mock('../../../src/actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
}));

describe('GroupScreen', () => {
  const header = (
    <GroupScreen
      navigation={createMockNavState({
        organization: { id: '5', name: 'Test  Org' },
      })}
    />
  );

  it('should render header correctly', () => {
    testSnapshotShallow(header);
  });
});
