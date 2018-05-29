import React from 'react';

import Members from '../Members';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../../testUtils';

const store = createMockStore({});

describe('Members', () => {
  const component = <Members />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should handleSelect correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleSelect = jest.fn();
    instance.handleSelect();
    expect(instance.handleSelect).toHaveBeenCalled();
  });

  it('should handleLoadMore correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleLoadMore = jest.fn();
    instance.handleLoadMore();
    expect(instance.handleLoadMore).toHaveBeenCalled();
  });
});
