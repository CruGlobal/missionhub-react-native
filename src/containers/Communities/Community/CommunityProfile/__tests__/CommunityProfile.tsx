/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';
import Config from 'react-native-config';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../testUtils';
import {
  navigateBack,
  navigateToMainTabs,
} from '../../../../../actions/navigation';
import {
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
  generateNewCode,
  generateNewLink,
} from '../../../../../actions/organizations';
import {
  trackActionWithoutData,
  trackScreenChange,
} from '../../../../../actions/analytics';
import { ACTIONS, COMMUNITIES_TAB } from '../../../../../constants';
import * as common from '../../../../../utils/common';
import { CommunityProfile } from '../CommunityProfile';
import { PermissionEnum } from '../../../../../../__generated__/globalTypes';
import PopupMenu from '../../../../../components/PopupMenu';
import ImagePicker from '../../../../../components/ImagePicker';

jest.mock('../../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigateToMainTabs: jest.fn(() => ({ type: 'navigateToMainTabs' })),
}));
jest.mock('../../../../../actions/organizations', () => ({
  updateOrganization: jest.fn(() => ({ type: 'update org' })),
  updateOrganizationImage: jest.fn(() => ({ type: 'update org image' })),
  deleteOrganization: jest.fn(() => ({ type: 'delete org' })),
  generateNewCode: jest.fn(() => ({ type: 'new code' })),
  generateNewLink: jest.fn(() => ({ type: 'new link' })),
}));
jest.mock('../../../../../actions/analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'Track Action' })),
  trackScreenChange: jest.fn(() => ({ type: 'track screen change' })),
}));
jest.mock('../../../../../selectors/organizations');
jest.mock('../../../../../utils/hooks/useAnalytics');

Alert.alert = jest.fn();

const communityId = '123';
const communityCode = '333333';
const communityUrl = 'abc123';

const initialState = {
  auth: {
    person: {
      id: '123',
    },
  },
};

// @ts-ignore
common.copyText = jest.fn();

describe('CommunityProfile', () => {
  it('should render loading state', () => {
    renderWithContext(<CommunityProfile />, {
      initialState,
      navParams: { communityId },
    }).snapshot();
  });

  it('should render correctly', async () => {
    const { recordSnapshot, diffSnapshot } = renderWithContext(
      <CommunityProfile />,
      {
        initialState,
        navParams: { communityId },
      },
    );
    recordSnapshot();
    await flushMicrotasksQueue();
    diffSnapshot();
  });

  it('renders without edit button', async () => {
    const { queryByTestId } = renderWithContext(<CommunityProfile />, {
      initialState,
      navParams: { communityId },
      mocks: {
        Query: () => ({
          community: () => ({
            userCreated: () => true,
            people: () => ({
              edges: () => [
                {
                  communityPermission: () => ({
                    permission: PermissionEnum.user,
                  }),
                },
              ],
            }),
          }),
        }),
      },
    });

    await flushMicrotasksQueue();

    expect(queryByTestId('editButton')).toBeNull();
  });

  it('renders with edit button', async () => {
    const { getByTestId } = renderWithContext(<CommunityProfile />, {
      initialState,
      navParams: { communityId },
      mocks: {
        Query: () => ({
          community: () => ({
            userCreated: () => true,
            people: () => ({
              edges: () => [
                {
                  communityPermission: () => ({
                    permission: PermissionEnum.owner,
                  }),
                },
              ],
            }),
          }),
        }),
      },
    });

    await flushMicrotasksQueue();

    getByTestId('editButton');
  });

  it('should handle copy code', async () => {
    const { getByTestId } = renderWithContext(<CommunityProfile />, {
      initialState,
      navParams: { communityId },
      mocks: { Community: () => ({ communityCode }) },
    });

    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('copyCodeButton'));

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.COPY_CODE);
    expect(common.copyText).toHaveBeenCalledWith(
      i18next.t('communityProfile:codeCopyText', {
        code: communityCode,
      }),
    );
  });

  it('should handle copy link', async () => {
    const { getByTestId } = renderWithContext(<CommunityProfile />, {
      initialState,
      navParams: { communityId },
      mocks: { Community: () => ({ communityCode, communityUrl }) },
    });

    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('copyUrlButton'));

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.COPY_INVITE_URL,
    );
    expect(common.copyText).toHaveBeenCalledWith(
      i18next.t('groupsMembers:sendInviteMessage', {
        url: `${Config.COMMUNITY_URL}${communityUrl}`,
        code: communityCode,
      }),
    );
  });

  it('handle navigate back', () => {
    const { getByTestId } = renderWithContext(<CommunityProfile />, {
      initialState,
      navParams: { communityId },
    });

    fireEvent.press(getByTestId('backButton'));

    expect(navigateBack).toHaveBeenCalled();
  });

  describe('edit screen', () => {
    it('renders editing state', async () => {
      const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
        <CommunityProfile />,
        {
          initialState,
          navParams: { communityId },
          mocks: {
            Community: () => ({
              userCreated: true,
              people: () => ({
                edges: () => [
                  {
                    communityPermission: () => ({
                      permission: PermissionEnum.owner,
                    }),
                  },
                ],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      recordSnapshot();
      fireEvent.press(getByTestId('editButton'));
      diffSnapshot();

      expect(trackScreenChange).toHaveBeenCalledWith([
        'community',
        'detail',
        'edit',
      ]);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.COMMUNITY_EDIT,
      );
    });

    it('should handle new code', async () => {
      const { getByTestId } = renderWithContext(<CommunityProfile />, {
        initialState,
        navParams: { communityId },
        mocks: {
          Community: () => ({
            userCreated: true,
            people: () => ({
              edges: () => [
                {
                  communityPermission: () => ({
                    permission: PermissionEnum.owner,
                  }),
                },
              ],
            }),
          }),
        },
      });
      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('editButton'));
      fireEvent.press(getByTestId('newCodeButton'));

      expect(Alert.alert).toHaveBeenCalled();
      (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(generateNewCode).toHaveBeenCalledWith(communityId);
    });

    it('should handle new link', async () => {
      const { getByTestId } = renderWithContext(<CommunityProfile />, {
        initialState,
        navParams: { communityId },
        mocks: {
          Community: () => ({
            userCreated: true,
            people: () => ({
              edges: () => [
                {
                  communityPermission: () => ({
                    permission: PermissionEnum.owner,
                  }),
                },
              ],
            }),
          }),
        },
      });
      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('editButton'));
      fireEvent.press(getByTestId('newUrlButton'));

      expect(Alert.alert).toHaveBeenCalled();
      //Manually call onPress
      (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(generateNewLink).toHaveBeenCalledWith(communityId);
    });

    it('handles delete organization', async () => {
      const { getByTestId, getAllByType } = renderWithContext(
        <CommunityProfile />,
        {
          initialState,
          navParams: { communityId },
          mocks: {
            Community: () => ({
              userCreated: true,
              people: () => ({
                edges: () => [
                  {
                    communityPermission: () => ({
                      permission: PermissionEnum.owner,
                    }),
                  },
                ],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('editButton'));
      getAllByType(PopupMenu)[1].props.actions[0].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        [
          {
            text: expect.any(String),
            style: 'cancel',
          },
          {
            text: expect.any(String),
            style: 'destructive',
            onPress: expect.any(Function),
          },
        ],
      );

      // @ts-ignore
      await Alert.alert.mock.calls[0][2][1].onPress();

      expect(deleteOrganization).toHaveBeenCalledWith(communityId);
      expect(navigateToMainTabs).toHaveBeenCalledWith(COMMUNITIES_TAB);
    });

    it('should stop editing', async () => {
      const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
        <CommunityProfile />,
        {
          initialState,
          navParams: { communityId },
          mocks: {
            Community: () => ({
              userCreated: true,
              people: () => ({
                edges: () => [
                  {
                    communityPermission: () => ({
                      permission: PermissionEnum.owner,
                    }),
                  },
                ],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('editButton'));
      recordSnapshot();
      fireEvent.press(getByTestId('editButton'));
      diffSnapshot();

      expect(trackScreenChange).toHaveBeenCalledWith(['community', 'detail']);
    });

    it('handles save with name change', async () => {
      const name = 'New Name';
      const { getByTestId } = renderWithContext(<CommunityProfile />, {
        initialState,
        navParams: { communityId },
        mocks: {
          Community: () => ({
            userCreated: true,
            people: () => ({
              edges: () => [
                {
                  communityPermission: () => ({
                    permission: PermissionEnum.owner,
                  }),
                },
              ],
            }),
          }),
        },
      });
      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('editButton'));
      fireEvent.changeText(getByTestId('nameInput'), name);
      fireEvent.press(getByTestId('editButton'));

      expect(updateOrganization).toHaveBeenCalledWith(communityId, { name });
    });

    it('handles save with image change', async () => {
      const data = { uri: 'testuri' };
      const { getByTestId, getByType } = renderWithContext(
        <CommunityProfile />,
        {
          initialState,
          navParams: { communityId },
          mocks: {
            Community: () => ({
              userCreated: true,
              people: () => ({
                edges: () => [
                  {
                    communityPermission: () => ({
                      permission: PermissionEnum.owner,
                    }),
                  },
                ],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('editButton'));
      fireEvent(getByType(ImagePicker), 'onSelectImage', data);
      fireEvent.press(getByTestId('editButton'));

      expect(updateOrganizationImage).toHaveBeenCalledWith(communityId, data);
    });

    it('handles save with image and name change', async () => {
      const name = 'New Name';
      const data = { uri: 'testuri' };
      const { getByTestId, getByType } = renderWithContext(
        <CommunityProfile />,
        {
          initialState,
          navParams: { communityId },
          mocks: {
            Community: () => ({
              userCreated: true,
              people: () => ({
                edges: () => [
                  {
                    communityPermission: () => ({
                      permission: PermissionEnum.owner,
                    }),
                  },
                ],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('editButton'));
      fireEvent.changeText(getByTestId('nameInput'), name);
      fireEvent(getByType(ImagePicker), 'onSelectImage', data);
      await fireEvent.press(getByTestId('editButton'));

      expect(updateOrganization).toHaveBeenCalledWith(communityId, { name });
      expect(updateOrganizationImage).toHaveBeenCalledWith(communityId, data);
    });
  });
});
