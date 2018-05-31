import React from 'react';

import Surveys from '../Surveys';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({});

const organization = { id: '1', name: 'Test Org' };

describe('Surveys', () => {
  const component = <Surveys organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should handleSelect correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    instance.handleSelect({ id: '1' });
    expect(navigatePush).toHaveBeenCalled();
  });

  it('should handleLoadMore correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    const result = instance.handleLoadMore();
    expect(result).toBe(true);
  });
});
