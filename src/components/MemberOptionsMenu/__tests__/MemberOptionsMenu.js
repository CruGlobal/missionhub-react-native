import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';

import MemberOptionsMenu from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const myId = '1';
const otherId = '2';

const person = { full_name: 'Roge' };
const organization = { name: "Roge's org" };

let props;

const test = () => {
  testSnapshotShallow(<MemberOptionsMenu {...props} />);
};

describe('MemberOptionsMenu', () => {
  describe('for me, as owner', () => {
    it('renders correctly', () => {
      props = {
        myId,
        person: {
          ...person,
          id: myId,
        },
        iAmAdmin: false,
        iAmOwner: true,
        personIsAdmin: false,
        organization,
      };

      test();
    });

    it('shows an alert message if I attempt to leave', () => {
      props = {
        myId,
        person: {
          ...person,
          id: myId,
        },
        iAmAdmin: false,
        iAmOwner: true,
        personIsAdmin: false,
        organization,
      };

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
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
      organization,
    };
    test();
  });

  it('renders for admin looking at admin', () => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: true,
      organization,
    };
    test();
  });

  it('renders for owner looking at member', () => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: true,
      personIsAdmin: false,
      organization,
    };
    test();
  });

  it('renders for owner looking at admin', () => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: true,
      personIsAdmin: true,
      organization,
    };
    test();
  });
});

describe('confirm screen', () => {
  Alert.alert = jest.fn();

  beforeEach(() => {
    Alert.alert.mockClear();
  });

  describe('Make Admin', () => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
      organization,
    };

    const component = renderShallow(<MemberOptionsMenu {...props} />);

    it('displays confirm screen', () => {
      const makeAdminMethod = component.makeAdmin;
      component.props().actions[0].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:makeAdmin:modalTitle', {
          personName: person.full_name,
          communityName: organization.name,
        }),
        i18next.t('groupMemberOptions:makeAdmin:modalDescription'),
        [
          {
            text: i18next.t('cancel'),
            style: 'cancel',
          },
          {
            text: i18next.t('groupMemberOptions:makeAdmin:confirmButtonText'),
            onPress: expect.any(Function),
          },
        ],
      );
    });
  });
});
