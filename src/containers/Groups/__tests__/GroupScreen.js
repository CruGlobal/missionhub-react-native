import React from 'react';

import { GroupScreen, CRU_TABS, USER_CREATED_TABS } from '../GroupScreen';
import {
  testSnapshotShallow,
  createMockNavState,
  createMockStore,
  renderShallow,
} from '../../../../testUtils';
import { ADD_CONTACT_SCREEN } from '../../AddContactScreen';
import { navigatePush } from '../../../actions/navigation';

jest.mock('../../../actions/navigation', () => ({
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

  it('should render Cru Community tabs correctly', () => {
    expect(CRU_TABS).toMatchSnapshot();
  });

  it('should render User Created Community tabs correctly', () => {
    expect(USER_CREATED_TABS).toMatchSnapshot();
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
