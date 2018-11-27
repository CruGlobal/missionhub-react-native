import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MemberOptionsMenu from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import {
  transferOrgOwnership,
  getMyCommunities,
  removeOrganizationMember,
} from '../../../actions/organizations';
import {
  makeAdmin,
  removeAsAdmin,
  archiveOrgPermission,
} from '../../../actions/person';
import { navigateBack } from '../../../actions/navigation';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';

jest.mock('../../../actions/organizations.js');
jest.mock('../../../actions/person.js');
jest.mock('../../../actions/navigation.js');
jest.mock('../../../actions/analytics.js');

const myId = '1';
const otherId = '2';
const organization = { name: "Roge's org", id: '08747283423' };
const personOrgPermission = { id: '25234234' };

const person = { full_name: 'Roge' };
const mockStore = configureStore([thunk]);

const trackActionResponse = { type: 'track action' };

let props;
let store;

const test = () => {
  testSnapshotShallow(<MemberOptionsMenu {...props} />);
};

describe('MemberOptionsMenu', () => {
  describe('for me, as owner', () => {
    beforeEach(() =>
      (props = {
        myId,
        person: {
          ...person,
          id: myId,
        },
        iAmAdmin: false,
        iAmOwner: true,
        personIsAdmin: false,
        organization,
      }));

    it('renders correctly', () => test());

    it('shows an alert message if I attempt to leave', () => {
      Alert.alert = jest.fn();
      const screen = renderShallow(<MemberOptionsMenu {...props} />);

      screen.props().actions[0].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:ownerLeaveCommunityErrorMessage', {
          orgName: organization.name,
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

  describe(' looking at member, when I am owner', () => {
    beforeEach(() =>
      (props = {
        myId,
        person: {
          ...person,
          id: otherId,
        },
        iAmAdmin: true,
        iAmOwner: true,
        personIsAdmin: false,
        organization,
      }));

    it('renders correctly', () => test());

    it('transfers ownership', () => {
      const transferResponse = { type: 'transferred ownership' };

      trackActionWithoutData.mockReturnValue(trackActionResponse);
      transferOrgOwnership.mockReturnValue(transferResponse);

      store = mockStore();
      const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

      screen.instance().makeOwner();

      expect(store.getActions()).toEqual([
        trackActionResponse,
        transferResponse,
      ]);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.MANAGE_MAKE_OWNER,
      );
      expect(transferOrgOwnership).toHaveBeenCalledWith(
        organization.id,
        otherId,
      );
    });
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

  let screen;

  beforeEach(() => {
    Alert.alert.mockClear();
    trackActionWithoutData.mockReturnValue(trackActionResponse);
  });

  describe('Make Admin', () => {
    const makeAdminResponse = { type: 'make admin' };
    makeAdmin.mockReturnValue(makeAdminResponse);

    beforeEach(() => {
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
        personOrgPermission,
      };

      store = mockStore();
      screen = renderShallow(<MemberOptionsMenu {...props} />, store);
    });

    it('displays confirm screen', () => {
      screen.props().actions[0].onPress();

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

    it('calls makeAdmin action', async () => {
      await screen.instance().makeAdmin();

      expect(store.getActions()).toEqual([
        trackActionResponse,
        makeAdminResponse,
      ]);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.MANAGE_MAKE_ADMIN,
      );
      expect(makeAdmin).toHaveBeenCalledWith(otherId, personOrgPermission.id);
    });
  });

  describe('Remove As Admin', () => {
    const removeAdminResponse = { type: 'remove admin' };
    removeAsAdmin.mockReturnValue(removeAdminResponse);

    beforeEach(() => {
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
        personOrgPermission,
      };

      store = mockStore();
      screen = renderShallow(<MemberOptionsMenu {...props} />, store);
    });

    it('displays confirm screen', () => {
      screen.props().actions[0].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:removeAdmin:modalTitle', {
          personName: person.full_name,
          communityName: organization.name,
        }),
        null,
        [
          {
            text: i18next.t('cancel'),
            style: 'cancel',
          },
          {
            text: i18next.t('groupMemberOptions:removeAdmin:confirmButtonText'),
            onPress: expect.any(Function),
          },
        ],
      );
    });

    it('calls removeAdmin action', async () => {
      await screen.instance().removeAsAdmin();

      expect(store.getActions()).toEqual([
        trackActionResponse,
        removeAdminResponse,
      ]);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.MANAGE_REMOVE_ADMIN,
      );
      expect(removeAsAdmin).toHaveBeenCalledWith(
        otherId,
        personOrgPermission.id,
      );
    });
  });

  describe('Leave Community', () => {
    const getMyCommunitiesResult = { type: 'got communities' };
    const navigateBackResult = { type: 'navigated back' };

    beforeEach(() => {
      props = {
        myId,
        person: {
          ...person,
          id: myId,
        },
        iAmAdmin: true,
        iAmOwner: false,
        personIsAdmin: false,
        organization,
        personOrgPermission,
      };

      store = mockStore();
    });

    it('sends api request to archive my permission', async () => {
      archiveOrgPermission.mockReturnValue(() => Promise.resolve());
      getMyCommunities.mockReturnValue(getMyCommunitiesResult);
      navigateBack.mockReturnValue(navigateBackResult);
      const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

      await screen.instance().leaveCommunity();

      expect(store.getActions()).toEqual([
        trackActionResponse,
        getMyCommunitiesResult,
        navigateBackResult,
      ]);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.MANAGE_LEAVE_COMMUNITY,
      );
      expect(archiveOrgPermission).toHaveBeenCalledWith(
        myId,
        personOrgPermission.id,
      );
    });
  });

  describe('Remove from Community', () => {
    const archiveOrgPermissionResult = { type: 'archived permission' };
    const removePersonResult = { type: 'removed person' };

    beforeEach(() => {
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
        personOrgPermission,
      };

      store = mockStore();
    });

    it("sends api request to archive person's permission", async () => {
      archiveOrgPermission.mockReturnValue(archiveOrgPermissionResult);
      removeOrganizationMember.mockReturnValue(removePersonResult);
      const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

      await screen.instance().removeFromCommunity();

      expect(store.getActions()).toEqual([
        trackActionResponse,
        archiveOrgPermissionResult,
        removePersonResult,
      ]);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.MANAGE_REMOVE_MEMBER,
      );
      expect(archiveOrgPermission).toHaveBeenCalledWith(
        otherId,
        personOrgPermission.id,
      );
      expect(removeOrganizationMember).toHaveBeenCalledWith(
        otherId,
        organization.id,
      );
    });
  });
});
