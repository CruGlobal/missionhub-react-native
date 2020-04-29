/*eslint max-lines: 0 */

import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';
import i18next from 'i18next';
import { useMutation } from '@apollo/react-hooks';

import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CELEBRATE_DETAIL_SCREEN } from '../../../containers/CelebrateDetailScreen';
import { CREATE_POST_SCREEN } from '../../../containers/Groups/CreatePostScreen';
import { Organization } from '../../../reducers/organizations';
import {
  COMMUNITY_FEED_ITEM_FRAGMENT,
  COMMUNITY_FEED_POST_FRAGMENT,
  COMMUNITY_FEED_STEP_FRAGMENT,
  COMMUNITY_FEED_CHALLENGE_FRAGMENT,
  COMMUNITY_FEED_PERSON_FRAGMENT,
} from '../queries';
import { CommunityFeedItem as CommunityFeedItemFragment } from '../../CommunityFeedItem/__generated__/CommunityFeedItem';
import { CommunityFeedPerson } from '../../CommunityFeedItem/__generated__/CommunityFeedPerson';
import { CommunityFeedStep } from '../__generated__/CommunityFeedStep';
import { CommunityFeedChallenge } from '../__generated__/CommunityFeedChallenge';
import { CommunityFeedPost } from '../__generated__/CommunityFeedPost';
import { DELETE_POST, REPORT_POST } from '../queries';

import { CommunityFeedItem } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../Avatar', () => 'Avatar');

const globalOrg: Organization = { id: GLOBAL_COMMUNITY_ID };
const organization: Organization = { id: '3', name: 'Communidad' };

const item = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
);
const mePerson = mockFragment<CommunityFeedPerson>(
  COMMUNITY_FEED_PERSON_FRAGMENT,
);
const postSubject = mockFragment<CommunityFeedPost>(
  COMMUNITY_FEED_POST_FRAGMENT,
);
const stepSubject = mockFragment<CommunityFeedStep>(
  COMMUNITY_FEED_STEP_FRAGMENT,
);
const challengeSubject = mockFragment<CommunityFeedChallenge>(
  COMMUNITY_FEED_CHALLENGE_FRAGMENT,
);
const myId = mePerson.id;

MockDate.set('2019-08-21 12:00:00', 300);

let onRefresh = jest.fn();
let onClearNotification = jest.fn();

const trackActionResult = { type: 'tracked plain action' };
const navigatePushResult = { type: 'navigate push' };

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  onRefresh = jest.fn();
  onClearNotification = jest.fn();
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

describe('global community', () => {
  it('renders correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        item={item}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders with clear notification button correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        item={item}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
        onClearNotification={onClearNotification}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders post item correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        item={{ ...item, subject: { ...postSubject, __typename: 'Post' } }}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });
});

describe('Community', () => {
  it('renders post correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        item={{ ...item, subject: { ...postSubject, __typename: 'Post' } }}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders step correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        item={{ ...item, subject: { ...stepSubject, __typename: 'Step' } }}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders challenge correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        item={{
          ...item,
          subject: { ...challengeSubject, __typename: 'CommunityChallenge' },
        }}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders with clear notification button correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        item={item}
        onRefresh={onRefresh}
        organization={organization}
        onClearNotification={onClearNotification}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });
});

it('renders with name pressable correctly', () => {
  renderWithContext(
    <CommunityFeedItem
      item={item}
      onRefresh={onRefresh}
      organization={organization}
      namePressable={true}
    />,
    { initialState },
  ).snapshot();
});

describe('press card', () => {
  it('not pressable in global community', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        item={item}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
      />,
      { initialState },
    );

    expect(getByTestId('CelebrateItemPressable').props.onPress).toEqual(
      undefined,
    );
  });

  it('navigates to celebrate detail screen', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        item={item}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('CelebrateItemPressable'));

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_DETAIL_SCREEN, {
      item,
      orgId: organization.id,
      onRefreshCelebrateItem: onRefresh,
    });
  });
});

describe('long-press card', () => {
  describe('post written by me', () => {
    const myPost: CommunityFeedItemFragment = {
      ...item,
      subject: { ...postSubject, __typename: 'Post' },
      subjectPerson: mePerson,
    };

    it('navigates to edit post screen', () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          item={myPost}
          onRefresh={onRefresh}
          organization={organization}
          namePressable={false}
        />,
        { initialState },
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        0,
      );

      expect(navigatePush).toHaveBeenCalledWith(CREATE_POST_SCREEN, {
        post: myPost,
        onComplete: onRefresh,
        communityId: organization.id,
      });
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('deletes post', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          item={myPost}
          onRefresh={onRefresh}
          organization={organization}
          namePressable={false}
        />,
        { initialState },
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        1,
      );
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(navigatePush).not.toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('celebrateItems:delete.title'),
        i18next.t('celebrateItems:delete.message'),
        [
          { text: i18next.t('cancel') },
          {
            text: i18next.t('celebrateItems:delete.buttonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(DELETE_POST, {
        variables: { id: postSubject.id },
      });
      expect(onRefresh).toHaveBeenCalled();
    });
  });

  describe('post written by other', () => {
    const otherPost: CommunityFeedItemFragment = {
      ...item,
      subject: { ...postSubject, __typename: 'Post' },
    };

    it('reports post', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          item={otherPost}
          onRefresh={onRefresh}
          organization={organization}
          namePressable={false}
        />,
        { initialState },
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        0,
      );
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(navigatePush).not.toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('celebrateItems:report.title'),
        i18next.t('celebrateItems:report.message'),
        [
          { text: i18next.t('cancel') },
          {
            text: i18next.t('celebrateItems:report.confirmButtonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(REPORT_POST, {
        variables: { id: postSubject.id },
      });
    });
  });
});

describe('clear notification button', () => {
  it('calls onClearNotification', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        item={item}
        onRefresh={onRefresh}
        organization={organization}
        onClearNotification={onClearNotification}
        namePressable={false}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('ClearNotificationButton'));

    expect(onClearNotification).toHaveBeenCalledWith(item);
  });
});
