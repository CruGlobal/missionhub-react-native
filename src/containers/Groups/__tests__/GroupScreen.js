import React from 'react';

import { GroupScreenHeader } from '../GroupScreen';
import {
  testSnapshotShallow,
  createMockNavState,
  renderShallow,
} from '../../../../testUtils';
import { navigateReset } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
  navigateReset: jest.fn(() => ({ type: 'test' })),
}));
import { MAIN_TABS } from '../../../constants';

describe('GroupScreenHeader', () => {
  const header = (
    <GroupScreenHeader
      navigation={createMockNavState({
        organization: { id: '5', name: 'Test  Org' },
      })}
    />
  );

  it('should render header correctly', () => {
    testSnapshotShallow(header);
  });
  it('should navigate back correctly', () => {
    renderShallow(header)
      .props()
      .left.props.customNavigate();
    expect(navigateReset).toHaveBeenCalledWith(MAIN_TABS);
  });
});
