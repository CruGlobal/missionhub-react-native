import React from 'react';

import { GroupScreen } from '../../../src/containers/Groups/GroupScreen';
import {
  testSnapshotShallow,
  createMockNavState,
  createMockStore,
  renderShallow,
} from '../../../testUtils';
import { ADD_CONTACT_SCREEN } from '../../../src/containers/AddContactScreen';
import { navigatePush } from '../../../src/actions/navigation';

jest.mock('../../../src/actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
  navigatePush: jest.fn(),
}));

const organization = { id: '5', name: 'Test  Org', user_created: false };

describe('GroupScreen', () => {
  const createHeader = org => (
    <GroupScreen
      navigation={createMockNavState({
        organization: org,
      })}
    />
  );

  it('should render header correctly', () => {
    testSnapshotShallow(createHeader(organization));
  });

  it('should render header correctly for user_created org', () => {
    testSnapshotShallow(createHeader({ ...organization, user_created: true }));
  });

  it('should handle add contact button correctly', () => {
    const instance = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization,
        })}
        store={createMockStore()}
      />,
    ).instance();

    instance.handleAddContact();

    expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
      onComplete: expect.anything(),
      organization,
    });
  });
});
