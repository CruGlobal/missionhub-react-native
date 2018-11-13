import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';

import MemberOptionsMenu from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const myId = '1';
const otherId = '2';

let props;

const test = () => {
  testSnapshotShallow(<MemberOptionsMenu {...props} />);
};

describe('MemberOptionsMenu', () => {
  describe('for me, as owner', () => {
    props = {
      myId,
      personId: myId,
      iAmAdmin: false,
      iAmOwner: true,
      personIsAdmin: false,
      organization: { name: "Roge's org" },
    };

    it('renders correctly', () => test());

    it('shows an alert message if I attempt to leave', () => {
      Alert.alert = jest.fn();
      const screen = renderShallow(<MemberOptionsMenu {...props} />);

      screen.props().actions[0].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:ownerLeaveCommunityErrorMessage', {
          orgName: props.organization.name,
        }),
        null,
        { text: i18next.t('ok') },
      );
    });
  });

  it('renders for admin looking at member', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
      organization: { name: "Roge's org" },
    };
    test();
  });

  it('renders for admin looking at admin', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: true,
      organization: { name: "Roge's org" },
    };
    test();
  });

  it('renders for owner looking at member', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: true,
      personIsAdmin: false,
      organization: { name: "Roge's org" },
    };
    test();
  });

  it('renders for owner looking at admin', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: true,
      personIsAdmin: true,
      organization: { name: "Roge's org" },
    };
    test();
  });
});
