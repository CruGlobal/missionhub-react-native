import React from 'react';

import Contact from '../Contact';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';

const store = createMockStore({});

const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', full_name: 'Test Person' };

describe('Contact', () => {
  const component = (
    <Contact
      navigation={createMockNavState({
        organization,
        person,
      })}
    />
  );

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should handleAssign correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    const result = instance.handleAssign();
    expect(result).toBe(true);
  });
});
