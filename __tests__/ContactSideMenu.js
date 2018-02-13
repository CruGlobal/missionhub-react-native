import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { createMockStore } from '../testUtils/index';
import ContactSideMenu from '../src/components/ContactSideMenu';
import { createMockNavState, testSnapshotShallow, renderShallow } from '../testUtils';

import { ADD_CONTACT_SCREEN } from '../src/containers/AddContactScreen';
import { navigatePush } from '../src/actions/navigation';
import { fetchVisiblePersonInfo, updateFollowupStatus } from '../src/actions/profile';
jest.mock('../src/actions/navigation');
jest.mock('../src/actions/profile');

beforeEach(() => {
  navigatePush.mockClear();
  fetchVisiblePersonInfo.mockClear();
});

describe('contactSideMenu Casey', () => {
  it('renders menu correctly', () => {
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
});

describe('contactSideMenu Jean', () => {
  it('renders menu correctly when missing org permission', () => {
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

  it('renders menu correctly with org permission', () => {
    const component = testSnapshotShallow(
      <ContactSideMenu navigation={createMockNavState({
        organization: {
          id: 5,
        },
      })} />,
      createMockStore({
        auth: { personId: 1 },
        stages: { stages: [ 'placeholder stage' ] },
        profile: {
          visiblePersonInfo: {
            isJean: true,
            person: {
              id: 2,
              first_name: 'Test Fname',
              organizational_permissions: [
                {
                  id: 1,
                  organization_id: 5,
                  followup_status: 'uncontacted',
                },
              ],
            },
            personIsCurrentUser: false,
          },
        },
      }),
    );

    testEditClick(component, true);
  });
  it('handles followup status clicks correctly', () => {
    const component = renderShallow(
      <ContactSideMenu navigation={createMockNavState({
        organization: {
          id: 5,
        },
      })} />,
      createMockStore({
        auth: { personId: 1 },
        stages: { stages: [ 'placeholder stage' ] },
        profile: {
          visiblePersonInfo: {
            isJean: true,
            person: {
              id: 2,
              first_name: 'Test Fname',
              organizational_permissions: [
                {
                  id: 1,
                  organization_id: 5,
                  followup_status: 'uncontacted',
                },
              ],
            },
            personIsCurrentUser: false,
          },
        },
      }),
    );

    testFollowupStatusClick(component, 'Attempted Contact', 2, 1, 'attempted_contact');
    testFollowupStatusClick(component, 'Completed', 2, 1, 'completed');
    testFollowupStatusClick(component, 'Contacted', 2, 1, 'contacted');
    testFollowupStatusClick(component, 'Do Not Contact', 2, 1, 'do_not_contact');
    testFollowupStatusClick(component, 'Uncontacted', 2, 1, 'uncontacted');
  });
});

function testEditClick(component, isJean) {
  const props = component.props();
  props.menuItems.filter((item) => item.label === 'Edit')[0].action();
  expect(navigatePush).toHaveBeenCalledTimes(1);
  expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
    'isJean': isJean,
    'onComplete': expect.any(Function),
    'person': expect.objectContaining({
      id: 2,
      first_name: 'Test Fname',
    }),
  });

  //Manually call onComplete
  navigatePush.mock.calls[0][1].onComplete();
  expect(fetchVisiblePersonInfo).toHaveBeenCalledWith(2, 1, false, [ 'placeholder stage' ]);
}

function testFollowupStatusClick(component, label, personId, orgPermissionId, serverValue) {
  const props = component.props();
  props.menuItems.filter((item) => item.label === label)[0].action();
  expect(updateFollowupStatus).toHaveBeenCalledWith(personId, orgPermissionId, serverValue);
}

