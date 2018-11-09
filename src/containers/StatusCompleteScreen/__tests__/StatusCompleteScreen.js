import React from 'react';

import StatusCompleteScreen from '..';

import { STATUS_REASON_SCREEN } from '../../StatusReasonScreen';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';

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
const contactAssignment = { id: '4' };

describe('StatusCompleteScreen', () => {
  const component = (
    <StatusCompleteScreen
      navigation={createMockNavState({
        person,
        organization,
        contactAssignment,
      })}
    />
  );

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should unassign and navigate away', () => {
    const instance = renderShallow(component, store).instance();
    navigation.navigatePush = jest.fn();
    const onSubmit = instance.onSubmitReason;
    instance.cancel();
    expect(navigation.navigatePush).toHaveBeenCalledWith(STATUS_REASON_SCREEN, {
      person,
      organization,
      contactAssignment,
      onSubmit,
    });
  });

  it('should complete', () => {
    const instance = renderShallow(component, store).instance();
    navigation.navigateBack = jest.fn();
    instance.complete();
    expect(navigation.navigateBack).toHaveBeenCalledWith(2);
  });
});
