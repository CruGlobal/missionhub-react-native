import React from 'react';

import {
  PersonScreen,
  ContactPersonScreen,
  MemberPersonScreen,
} from '../PersonScreen';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../../testUtils';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({});

const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', full_name: 'Test Person' };

const ContactComponent = (
  <ContactPersonScreen
    navigation={createMockNavState({
      organization,
      person,
    })}
  />
);

const MemberComponent = (
  <MemberPersonScreen
    navigation={createMockNavState({
      organization,
      person,
    })}
  />
);

describe('Contact', () => {
  it('should render PersonScreen correctly', () => {
    testSnapshotShallow(
      <PersonScreen
        navigation={createMockNavState({
          organization,
          person,
        })}
      />,
      store,
    );
  });

  it('should render ContactPersonScreen correctly', () => {
    testSnapshotShallow(ContactComponent);
  });

  it('should render MemberPersonScreen correctly', () => {
    testSnapshotShallow(MemberComponent);
  });
});
