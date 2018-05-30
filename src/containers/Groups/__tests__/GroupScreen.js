import React from 'react';

import { GroupScreen } from '../GroupScreen';
import {
  testSnapshotShallow,
  createMockNavState,
  renderShallow,
} from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
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
  it('should navigate back correctly', () => {
    renderShallow(header)
      .props()
      .left.props.customNavigate();
    expect(navigateBack).toHaveBeenCalled();
  });
});
