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

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should navigate back', async () => {
    const instance = renderShallow(component, store).instance();
    navigation.navigateBack = jest.fn();
    await instance.submit();
    expect(navigation.navigateBack).toHaveBeenCalled();
  });

  it('should update status to attempted_contact', async () => {
    const instance = renderShallow(component, store).instance();
    instance.setState({ selected: 'attempted_contact' });
    await instance.submit();
    expect(updateFollowupStatus).toHaveBeenCalledWith(
      person,
      orgPermission.id,
      'attempted_contact',
    );
  });

  it('should update status to completed', async () => {
    const instance = renderShallow(component, store).instance();
    instance.setState({ selected: 'completed' });
    navigation.navigatePush = jest.fn();
    await instance.submit();
    expect(updateFollowupStatus).toHaveBeenCalledWith(
      person,
      orgPermission.id,
      'completed',
    );
    expect(navigation.navigatePush).toHaveBeenCalled();
  });

  it('should update status to do_not_contact', async () => {
    const instance = renderShallow(component, store).instance();
    instance.setState({ selected: 'do_not_contact' });
    navigation.navigatePush = jest.fn();
    await instance.submit();
    expect(updateFollowupStatus).toHaveBeenCalledWith(
      person,
      orgPermission.id,
      'do_not_contact',
    );
    expect(navigation.navigatePush).toHaveBeenCalled();
  });

  it('set the state to contacted', () => {
    const instance = renderShallow(component, store).instance();
    const status = 'contacted';
    instance.select(status);
    expect(instance.state.selected).toEqual(status);
  });
});
