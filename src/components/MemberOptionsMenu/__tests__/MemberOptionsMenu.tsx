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
import { PermissionEnum } from '../../../../__generated__/globalTypes';

import MemberOptionsMenu, {
  API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE,
} from '..';

jest.mock('../../../actions/organizations');
jest.mock('../../../actions/person');
jest.mock('../../../actions/navigation');

const myId = '1';
const otherId = '2';
const organization = { name: "Roge's org", id: '08747283423' };
const personOrgPermission = { id: '25234234', permission: PermissionEnum.user };

const person = { id: '1', full_name: 'Test Person' };
const mockStore = configureStore([thunk]);

// @ts-ignore
let props;
// @ts-ignore
let store;
const onActionTaken = jest.fn();
const defaultProps = { t: i18next.t, dispatch: () => {}, myId, onActionTaken };

const test = () => {
  // @ts-ignore
  testSnapshotShallow(<MemberOptionsMenu {...props} />);
};

describe('MemberOptionsMenu', () => {
  describe('for me, as owner', () => {
    beforeEach(
      () =>
        (props = {
          ...defaultProps,
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
      // @ts-ignore
      const screen = renderShallow(<MemberOptionsMenu {...props} />);

      // @ts-ignore
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
      ...defaultProps,
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
      ...defaultProps,
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
          ...defaultProps,
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
      // @ts-ignore
      transferOrgOwnership.mockReturnValue({ type: 'transferred ownership' });
      // @ts-ignore
      const screen = renderShallow(<MemberOptionsMenu {...props} />);

      // @ts-ignore
      screen.instance().makeOwner();

      expect(transferOrgOwnership).toHaveBeenCalledWith(
        organization.id,
        otherId,
      );
    });

    it('shows error message for Try It Now users', async () => {
      // @ts-ignore
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

      // @ts-ignore
      await renderShallow(<MemberOptionsMenu {...props} />)
        .instance()
        // @ts-ignore
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
      // @ts-ignore
      transferOrgOwnership.mockReturnValue(() => Promise.reject(error));

      try {
        // @ts-ignore
        await renderShallow(<MemberOptionsMenu {...props} />)
          .instance()
          // @ts-ignore
          .makeOwner();
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });

  it('renders for owner looking at admin', () => {
    props = {
      ...defaultProps,
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

  // @ts-ignore
  let screen;

  describe('Make Admin', () => {
    const makeAdminResponse = { type: 'make admin' };

    beforeEach(() => {
      props = {
        ...defaultProps,
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
      // @ts-ignore
      makeAdmin.mockReturnValue(makeAdminResponse);

      // @ts-ignore
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
      // @ts-ignore
      makeAdmin.mockReturnValue(makeAdminResponse);

      // @ts-ignore
      await screen.instance().makeAdmin();

      // @ts-ignore
      expect(store.getActions()).toEqual([makeAdminResponse]);
      expect(makeAdmin).toHaveBeenCalledWith(otherId, personOrgPermission.id);
    });

    it('shows error message for Try It Now users', async () => {
      // @ts-ignore
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

      // @ts-ignore
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
      // @ts-ignore
      makeAdmin.mockReturnValue(() => Promise.reject(error));

      try {
        // @ts-ignore
        await screen.instance().makeAdmin();
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });

  describe('Remove As Admin', () => {
    const removeAdminResponse = { type: 'remove admin' };
    // @ts-ignore
    removeAsAdmin.mockReturnValue(removeAdminResponse);

    beforeEach(() => {
      props = {
        ...defaultProps,
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
      // @ts-ignore
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
      // @ts-ignore
      await screen.instance().removeAsAdmin();

      // @ts-ignore
      expect(store.getActions()).toEqual([removeAdminResponse]);
      expect(onActionTaken).toHaveBeenCalled();
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
      ...defaultProps,
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
    // @ts-ignore
    navigateBack.mockReturnValue(navigateBackResult);
    // @ts-ignore
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    // @ts-ignore
    await screen.instance().leaveCommunity();

    expect(onActionTaken).toHaveBeenCalled();
    // @ts-ignore
    expect(store.getActions()).toEqual([navigateBackResult]);
  });

  it('sends api request to archive my permission on unmount if leaveCommunityOnUnmount flag set', async () => {
    // @ts-ignore
    archiveOrgPermission.mockReturnValue(() => Promise.resolve());
    // @ts-ignore
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    // @ts-ignore
    screen.instance().leaveCommunityOnUnmount = true;
    // @ts-ignore
    await screen.instance().componentWillUnmount();

    expect(archiveOrgPermission).toHaveBeenCalledWith(
      myId,
      personOrgPermission.id,
    );
  });

  it('does nothing on unmount if leaveCommunityOnUnmount flag unset', async () => {
    // @ts-ignore
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    // @ts-ignore
    await screen.instance().componentWillUnmount();

    // @ts-ignore
    expect(store.getActions()).toEqual([]);
    expect(archiveOrgPermission).not.toHaveBeenCalled();
  });
});

describe('Remove from Community', () => {
  const archiveOrgPermissionResult = { type: 'archived permission' };
  const removePersonResult = { type: 'removed person' };

  beforeEach(() => {
    props = {
      ...defaultProps,
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
    // @ts-ignore
    archiveOrgPermission.mockReturnValue(archiveOrgPermissionResult);
    // @ts-ignore
    removeOrganizationMember.mockReturnValue(removePersonResult);
    // @ts-ignore
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    // @ts-ignore
    await screen.instance().removeFromCommunity();

    // @ts-ignore
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
