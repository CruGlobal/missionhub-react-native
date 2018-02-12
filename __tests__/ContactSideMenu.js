import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { createMockStore } from '../testUtils/index';
import ContactSideMenu from '../src/components/ContactSideMenu';
import { testSnapshotShallow } from '../testUtils';

import { ADD_CONTACT_SCREEN } from '../src/containers/AddContactScreen';
import { navigatePush } from '../src/actions/navigation';
import { fetchVisiblePersonInfo } from '../src/actions/profile';
jest.mock('../src/actions/navigation');
jest.mock('../src/actions/profile');

beforeEach(() => {
  navigatePush.mockClear();
  fetchVisiblePersonInfo.mockClear();
});

it('renders Casey menu correctly', () => {
  const component = testSnapshotShallow(
    <ContactSideMenu />,
    createMockStore({
      auth: { personId: 1 },
      stages: { stages: [ 'placeholder stage' ] },
      profile: {
        visiblePersonInfo: {
          isJean: false,
          person: {
            id: 2,
            first_name: 'Test Fname',
          },
          personIsCurrentUser: false,
        },
      },
    }),
  );

  testEditClick(component, false);
});

it('renders Jean menu correctly', () => {
  const component = testSnapshotShallow(
    <ContactSideMenu />,
    createMockStore({
      auth: { personId: 1 },
      stages: { stages: [ 'placeholder stage' ] },
      profile: {
        visiblePersonInfo: {
          isJean: true,
          person: {
            id: 2,
            first_name: 'Test Fname',
          },
          personIsCurrentUser: false,
        },
      },
    }),
  );

  testEditClick(component, true);
});

function testEditClick(component, isJean) {
  const props = component.props();
  props.menuItems.filter((item) => item.label === 'Edit')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
    'isJean': isJean,
    'onComplete': expect.any(Function),
    'person': {
      id: 2,
      first_name: 'Test Fname',
    },
  });

  //Manually call onComplete
  navigatePush.mock.calls[0][1].onComplete();
  expect(fetchVisiblePersonInfo).toHaveBeenCalledWith(2, 1, false, [ 'placeholder stage' ]);
}
