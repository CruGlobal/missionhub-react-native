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

const store = createMockStore({});

const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', full_name: 'Test Person' };

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
    testSnapshotShallow(
      <ContactPersonScreen
        navigation={createMockNavState({
          organization,
          person,
        })}
      />,
      store,
    );
  });

  it('should render MemberPersonScreen correctly', () => {
    testSnapshotShallow(
      <MemberPersonScreen
        navigation={createMockNavState({
          organization,
          person,
        })}
      />,
      store,
    );
  });
});
