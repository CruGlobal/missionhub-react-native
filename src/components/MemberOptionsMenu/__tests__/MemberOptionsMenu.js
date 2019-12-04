/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import {
  transferOrgOwnership,
  removeOrganizationMember,
} from '../../../actions/organizations';
import {
  makeAdmin,
  removeAsAdmin,
  archiveOrgPermission,
} from '../../../actions/person';
import { navigateBack } from '../../../actions/navigation';

import MemberOptionsMenu, {
  API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE,
} from '..';

jest.mock('../../../actions/organizations.js');
jest.mock('../../../actions/person.js');
jest.mock('../../../actions/navigation.js');

const myId = '1';
const otherId = '2';
const organization = { name: "Roge's org", id: '08747283423' };
const personOrgPermission = { id: '25234234' };

const person = { full_name: 'Roge' };
const mockStore = configureStore([thunk]);

let props;
let store;

const test = () => {
  testSnapshotShallow(<MemberOptionsMenu {...props} />);
};

describe('MemberOptionsMenu', () => {
  describe('for me, as owner', () => {
    beforeEach(
      () =>
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
        }),
    );

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
    beforeEach(
      () =>
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
        }),
    );

    it('renders correctly', () => test());

    it('transfers ownership', () => {
      transferOrgOwnership.mockReturnValue({ type: 'transferred ownership' });
      const screen = renderShallow(<MemberOptionsMenu {...props} />);

      screen.instance().makeOwner();

      expect(transferOrgOwnership).toHaveBeenCalledWith(
        organization.id,
        otherId,
      );
    });

    it('shows error message for Try It Now users', async () => {
      transferOrgOwnership.mockReturnValue(() =>
        Promise.reject({
          apiError: {
            errors: [
              {
                detail: 'blah ' + API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE,
              },
            ],
          },
        }),
      );

      await renderShallow(<MemberOptionsMenu {...props} />)
        .instance()
        .makeOwner();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:tryItNowAdminOwnerErrorMessage'),
      );
    });

    it('throws unexpected errors', async () => {
      expect.assertions(1);
      const error = {
        apiError: {
          errors: [
            {
              detail: 'SCOTTTTYYYYYYYYYYYYYYYYYYYYYY',
            },
          ],
        },
      };
      transferOrgOwnership.mockReturnValue(() => Promise.reject(error));

      try {
        await renderShallow(<MemberOptionsMenu {...props} />)
          .instance()
          .makeOwner();
      } catch (e) {
        expect(e).toEqual(error);
      }
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

  describe('Make Admin', () => {
    const makeAdminResponse = { type: 'make admin' };

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
      makeAdmin.mockReturnValue(makeAdminResponse);

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
      makeAdmin.mockReturnValue(makeAdminResponse);

      await screen.instance().makeAdmin();

      expect(store.getActions()).toEqual([makeAdminResponse]);
      expect(makeAdmin).toHaveBeenCalledWith(otherId, personOrgPermission.id);
    });

    it('shows error message for Try It Now users', async () => {
      makeAdmin.mockReturnValue(() =>
        Promise.reject({
          apiError: {
            errors: [
              {
                detail: {
                  permission_id: [API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE],
                },
              },
            ],
          },
        }),
      );

      await screen.instance().makeAdmin();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:tryItNowAdminOwnerErrorMessage'),
      );
    });

    it('throws unexpected errors', async () => {
      expect.assertions(1);
      const error = {
        apiError: {
          errors: [
            {
              detail: 'SCOTTTTYYYYYYYYYYYYYYYYYYYYYY',
            },
          ],
        },
      };
      makeAdmin.mockReturnValue(() => Promise.reject(error));

      try {
        await screen.instance().makeAdmin();
      } catch (e) {
        expect(e).toEqual(error);
      }
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

      expect(store.getActions()).toEqual([removeAdminResponse]);
      expect(removeAsAdmin).toHaveBeenCalledWith(
        otherId,
        personOrgPermission.id,
      );
    });
  });
});

describe('Leave Community', () => {
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

  it('sets flag to archive my permission on unmount', async () => {
    navigateBack.mockReturnValue(navigateBackResult);
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    await screen.instance().leaveCommunity();

    expect(store.getActions()).toEqual([navigateBackResult]);
  });

  it('sends api request to archive my permission on unmount if leaveCommunityOnUnmount flag set', async () => {
    archiveOrgPermission.mockReturnValue(() => Promise.resolve());
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    screen.instance().leaveCommunityOnUnmount = true;
    await screen.instance().componentWillUnmount();

    expect(archiveOrgPermission).toHaveBeenCalledWith(
      myId,
      personOrgPermission.id,
    );
  });

  it('does nothing on unmount if leaveCommunityOnUnmount flag unset', async () => {
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    await screen.instance().componentWillUnmount();

    expect(store.getActions()).toEqual([]);
    expect(archiveOrgPermission).not.toHaveBeenCalled();
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
      archiveOrgPermissionResult,
      removePersonResult,
    ]);
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
