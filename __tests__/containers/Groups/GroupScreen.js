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

const organization = { id: '5', name: 'Test  Org' };

describe('GroupScreen', () => {
  const header = (
    <GroupScreen
      navigation={createMockNavState({
        organization: { id: '5', name: 'Test  Org' },
      })}
    />
  );

  it('should render header correctly', () => {
    testSnapshotShallow(header);
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
