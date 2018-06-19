import React from 'react';
import MockDate from 'mockdate';

import Contact from '../Contact';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';

MockDate.set('2017-06-18');
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
    const instance = renderShallow(component, store).instance();
    const result = instance.handleAssign();
    expect(result).toBe(true);
  });

  it('should submit correctly', () => {
    const data = { id: 'test' };
    const instance = renderShallow(component, store).instance();
    const result = instance.submit(data);
    expect(result).toBe(data);
  });
});
