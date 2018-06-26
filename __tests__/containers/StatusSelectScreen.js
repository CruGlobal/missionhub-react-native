import React from 'react';

import StatusSelectScreen from '../../src/containers/StatusSelectScreen';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../testUtils';
import { updateFollowupStatus } from '../../src/actions/person';
import * as navigation from '../../src/actions/navigation';
import { STATUS_COMPLETE_SCREEN } from '../../src/containers/StatusCompleteScreen';
import { STATUS_REASON_SCREEN } from '../../src/containers/StatusReasonScreen';
jest.mock('../../src/actions/person', () => ({
  updateFollowupStatus: jest.fn(() => Promise.resolve()),
}));

const store = createMockStore({});
const orgPermission = { id: 'orgPerm1', organization_id: '1' };

const person = {
  id: 'person1',
  full_name: 'Person One',
  organizational_permissions: [orgPermission],
};
const organization = { id: '1', name: 'Test Org' };

describe('StatusSelectScreen', () => {
  const component = (
    <StatusSelectScreen
      navigation={createMockNavState({
        person,
        organization,
      })}
    />
  );
  navigation.navigateBack = jest.fn();
  navigation.navigatePush = jest.fn();

  const testSubmit = async type => {
    const instance = renderShallow(component, store).instance();
    instance.setState({ selected: type });
    await instance.submit();
    expect(updateFollowupStatus).toHaveBeenCalledWith(
      person,
      orgPermission.id,
      type,
    );
  };

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should navigate back', async () => {
    const instance = renderShallow(component, store).instance();
    await instance.submit();
    expect(navigation.navigateBack).toHaveBeenCalled();
  });

  it('should update status to attempted_contact', async () => {
    await testSubmit('attempted_contact');
  });

  it('should update status to completed', async () => {
    await testSubmit('completed');

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      STATUS_COMPLETE_SCREEN,
      {
        organization,
        person,
      },
    );
  });

  it('should update status to do_not_contact', async () => {
    await testSubmit('do_not_contact');
    expect(navigation.navigatePush).toHaveBeenCalledWith(STATUS_REASON_SCREEN, {
      organization,
      person,
    });
  });

  it('set the state to contacted', () => {
    const instance = renderShallow(component, store).instance();
    const status = 'contacted';
    instance.select(status);
    expect(instance.state.selected).toEqual(status);
  });
});
