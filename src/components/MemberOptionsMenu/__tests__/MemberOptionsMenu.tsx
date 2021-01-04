/* eslint-disable max-lines */

import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';

import { renderWithContext } from '../../../../testUtils';
import { transferOrgOwnership } from '../../../actions/organizations';
import {
  makeAdmin,
  removeAsAdmin,
  archiveOrgPermission,
} from '../../../actions/person';
import { navigateToMainTabs } from '../../../actions/navigation';
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

let props: unknown;
const onActionTaken = jest.fn();
const defaultProps = { t: i18next.t, dispatch: () => {}, myId, onActionTaken };

const testMembersOptionsMenu = () => {
  renderWithContext(
    // @ts-ignore
    <MemberOptionsMenu {...props} />,
  ).snapshot();
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

    it('renders correctly', () => {
      testMembersOptionsMenu();
      expect.hasAssertions();
    });

    it('shows an alert message if I attempt to leave', () => {
      Alert.alert = jest.fn();
      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[0].onPress();

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
    testMembersOptionsMenu();
    expect.hasAssertions();
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
    testMembersOptionsMenu();
    expect.hasAssertions();
  });

  describe('looking at member, when I am owner', () => {
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

    it('renders correctly', () => {
      testMembersOptionsMenu();
      expect.hasAssertions();
    });

    it('transfers ownership', () => {
      (transferOrgOwnership as jest.Mock).mockReturnValue({
        type: 'transferred ownership',
      });
      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[1].onPress();
      (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(transferOrgOwnership).toHaveBeenCalledWith(
        organization.id,
        otherId,
      );
    });

    it('shows error message for Try It Now users', async () => {
      (transferOrgOwnership as jest.Mock).mockReturnValue(() =>
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

      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[1].onPress();
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

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
      (transferOrgOwnership as jest.Mock).mockReturnValue(() =>
        Promise.reject(error),
      );

      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[1].onPress();
      await expect(
        (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress(),
      ).rejects.toEqual(error);
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
    testMembersOptionsMenu();
    expect.hasAssertions();
  });
});

describe('confirm screen', () => {
  Alert.alert = jest.fn();

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
    });

    it('displays confirm screen', () => {
      (makeAdmin as jest.Mock).mockReturnValue(makeAdminResponse);

      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[0].onPress();

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

    it('calls makeAdmin action', () => {
      (makeAdmin as jest.Mock).mockReturnValue(makeAdminResponse);

      const { store, getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[0].onPress();
      (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(store.getActions()).toEqual([makeAdminResponse]);
      expect(makeAdmin).toHaveBeenCalledWith(otherId, personOrgPermission.id);
    });

    it('shows error message for Try It Now users', async () => {
      (makeAdmin as jest.Mock).mockReturnValue(() =>
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

      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[0].onPress();
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:tryItNowAdminOwnerErrorMessage'),
      );
    });

    it('throws unexpected errors', async () => {
      const error = {
        apiError: {
          errors: [
            {
              detail: 'SCOTTTTYYYYYYYYYYYYYYYYYYYYYY',
            },
          ],
        },
      };
      (makeAdmin as jest.Mock).mockReturnValue(() => Promise.reject(error));

      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[0].onPress();
      await expect(
        (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress(),
      ).rejects.toEqual(error);
    });
  });

  describe('Remove As Admin', () => {
    const removeAdminResponse = { type: 'remove admin' };
    (removeAsAdmin as jest.Mock).mockReturnValue(removeAdminResponse);

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
    });

    it('displays confirm screen', () => {
      const { getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[0].onPress();

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
      const { store, getByTestId } = renderWithContext(
        // @ts-ignore
        <MemberOptionsMenu {...props} />,
      );

      getByTestId('popupMenu').props.actions[0].onPress();
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

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
  const navigateToMainTabResults = { type: 'navigated to main community tab' };

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
  });

  it('sets flag to archive my permission on unmount', async () => {
    (navigateToMainTabs as jest.Mock).mockReturnValue(navigateToMainTabResults);
    const { store, getByTestId } = renderWithContext(
      // @ts-ignore
      <MemberOptionsMenu {...props} />,
    );

    getByTestId('popupMenu').props.actions[0].onPress();
    await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

    expect(onActionTaken).toHaveBeenCalled();
    expect(store.getActions()).toEqual([navigateToMainTabResults]);
  });

  it('sends api request to archive my permission on unmount if leaveCommunityOnUnmount flag set', async () => {
    (archiveOrgPermission as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );
    const { getByTestId, unmount } = renderWithContext(
      // @ts-ignore
      <MemberOptionsMenu {...props} />,
    );

    getByTestId('popupMenu').props.actions[0].onPress();
    await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
    unmount();

    expect(archiveOrgPermission).toHaveBeenCalledWith(
      myId,
      personOrgPermission.id,
    );
  });

  it('does nothing on unmount if leaveCommunityOnUnmount flag unset', () => {
    const { store, unmount } = renderWithContext(
      // @ts-ignore
      <MemberOptionsMenu {...props} />,
    );

    unmount();

    expect(store.getActions()).toEqual([]);
    expect(archiveOrgPermission).not.toHaveBeenCalled();
  });
});

describe('Remove from Community', () => {
  const archiveOrgPermissionResult = { type: 'archived permission' };

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
  });

  it("sends api request to archive person's permission", async () => {
    (archiveOrgPermission as jest.Mock).mockReturnValue(
      archiveOrgPermissionResult,
    );
    const { store, getByTestId } = renderWithContext(
      // @ts-ignore
      <MemberOptionsMenu {...props} />,
    );

    getByTestId('popupMenu').props.actions[1].onPress();
    await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

    expect(store.getActions()).toEqual([archiveOrgPermissionResult]);
    expect(archiveOrgPermission).toHaveBeenCalledWith(
      otherId,
      personOrgPermission.id,
    );
  });
});
