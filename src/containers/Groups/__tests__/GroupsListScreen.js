import React from 'react';

import GroupsListScreen from '../GroupsListScreen';
import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

describe('Contacts', () => {
  const component = <GroupsListScreen />;

  it('should render correctly', () => {
    testSnapshotShallow(component);
  });

  it('should handlePress correctly', () => {
    const instance = renderShallow(component).instance();
    instance.handlePress();
    expect(navigatePush).toHaveBeenCalled();
  });
});
