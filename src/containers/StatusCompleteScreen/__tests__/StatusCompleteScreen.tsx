import React from 'react';

import { STATUS_REASON_SCREEN } from '../../StatusReasonScreen';
import {
  createThunkStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';

import StatusCompleteScreen from '..';

const store = createThunkStore({
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
    // @ts-ignore
    navigation.navigatePush = jest.fn(() => ({ type: 'navigated push' }));
    // @ts-ignore
    const onSubmit = instance.onSubmitReason;
    // @ts-ignore
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
    // @ts-ignore
    navigation.navigateBack = jest.fn(() => ({ type: 'navigated back' }));
    // @ts-ignore
    instance.complete();
    expect(navigation.navigateBack).toHaveBeenCalledWith(2);
  });
});
