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
    const person = { id: '1' };
    const result = instance.handleSelect(person);
    expect(result).toBe(person);
  });

  it('should handleLoadMore correctly', () => {
    const instance = renderShallow(component, store).instance();
    const result = instance.handleLoadMore();
    expect(result).toBe(true);
  });
});
