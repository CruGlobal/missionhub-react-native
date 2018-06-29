import React from 'react';

import StatusReasonScreen from '../../src/containers/StatusReasonScreen';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../testUtils';

const store = createMockStore({
  auth: {
    person: {
      id: '123',
      first_name: 'Me',
    },
  },
});

const orgPermission = { id: 'orgPerm1', organization_id: '1' };
const person = {
  id: 'person1',
  first_name: 'Person',
  full_name: 'Person One',
  organizational_permissions: [orgPermission],
};
const organization = { id: '1', name: 'Test Org' };

describe('StatusReasonScreen', () => {
  const component = (
    <StatusReasonScreen
      navigation={createMockNavState({
        person,
        organization,
      })}
    />
  );

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should change text', () => {
    const instance = renderShallow(component, store).instance();
    const text = 'test';
    instance.handleChangeText(text);
    expect(instance.state.text).toBe(text);
  });

  it('should submit with true', () => {
    const instance = renderShallow(component, store).instance();
    const text = 'test';
    instance.setState({ text });
    const result = instance.submit();
    expect(result).toBe(true);
  });

  it('should submit with false', () => {
    const instance = renderShallow(component, store).instance();
    const result = instance.submit();
    expect(result).toBe(false);
  });
});
