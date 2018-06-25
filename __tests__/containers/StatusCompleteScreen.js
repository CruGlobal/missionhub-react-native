import React from 'react';

import StatusCompleteScreen from '../../src/containers/StatusCompleteScreen';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../testUtils';
import * as navigation from '../../src/actions/navigation';

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

describe('StatusCompleteScreen', () => {
  const component = (
    <StatusCompleteScreen
      navigation={createMockNavState({
        person,
        organization,
      })}
    />
  );

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should unassign and navigate away', () => {
    const instance = renderShallow(component, store).instance();
    navigation.navigatePush = jest.fn();
    instance.cancel();
    expect(navigation.navigatePush).toHaveBeenCalled();
  });

  it('should complete', () => {
    const instance = renderShallow(component, store).instance();
    const result = instance.complete();
    expect(result).toBe(false);
  });
});
