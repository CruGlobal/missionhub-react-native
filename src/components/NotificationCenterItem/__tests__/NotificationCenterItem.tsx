import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { navigatePush } from '../../../actions/navigation';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { renderWithContext } from '../../../../testUtils';
import { NOTIFICATION_ITEM_FRAGMENT } from '../queries';
import { NotificationItem } from '../__generated__/NotificationItem';
import { FEED_ITEM_DETAIL_SCREEN } from '../../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedItemDetailScreen';
import {
  NotificationTriggerEnum,
  PostTypeEnum,
} from '../.../../../../../__generated__/globalTypes';

import NotificationCenterItem from '..';

jest.mock('../../../actions/navigation');

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
});

it('renders correctly', () => {
  renderWithContext(
    <NotificationCenterItem
      event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              'A new story has been added in <<community_name>>',
            trigger: () => NotificationTriggerEnum.story_notification,
            messageVariables: () => [
              {
                key: '<<community_name>>>',
                value: 'Bleh 2.0',
              },
            ],
          }),
        },
      })}
    />,
  ).snapshot();
});

describe('different notification types', () => {
  function notificationType(
    localized_post_type: string,
    post_type_enum: PostTypeEnum | null,
  ) {
    renderWithContext(
      <NotificationCenterItem
        event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
          mocks: {
            Notification: () => ({
              messageTemplate: () =>
                '<<person_name>> posted a new <<localized_post_type>> in <<community_name>>',
              trigger: () => NotificationTriggerEnum.story_notification,
              messageVariables: () => [
                {
                  key: 'localized_post_type',
                  value: localized_post_type,
                },
                {
                  key: 'post_type_enum',
                  value: post_type_enum,
                },
                {
                  key: 'community_name',
                  value: 'Bleh 2.0',
                },
                {
                  key: 'person_name',
                  value: 'Christian Huffman',
                },
              ],
            }),
          },
        })}
      />,
    ).snapshot();
  }

  it('renders correctly | Prayer Request', () => {
    notificationType('prayer request', PostTypeEnum.prayer_request);
  });
  it('renders correctly | Spiritual Question', () => {
    notificationType('spiritual question', PostTypeEnum.question);
  });
  it('renders correctly | Care request', () => {
    notificationType('care request', PostTypeEnum.help_request);
  });
  it('renders correctly | God Story', () => {
    notificationType('god story', PostTypeEnum.story);
  });
  it('renders correctly | Thought', () => {
    notificationType('thought', PostTypeEnum.thought);
  });
  it('renders correctly | Community Challenge', () => {
    renderWithContext(
      <NotificationCenterItem
        event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
          mocks: {
            Notification: () => ({
              messageTemplate: () =>
                'You have a new Challenge in <<community_name>>',
              trigger: () =>
                NotificationTriggerEnum.community_challenge_created_alert,
              messageVariables: () => [
                {
                  key: 'community_name',
                  value: 'Bleh 2.0',
                },
              ],
            }),
          },
        })}
      />,
    ).snapshot();
  });
  it('renders correctly | Comment', () => {
    renderWithContext(
      <NotificationCenterItem
        event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
          mocks: {
            Notification: () => ({
              messageTemplate: () =>
                "There's a new comment in a step of faith <<subject_person>> took! Go see what God did.",
              trigger: () =>
                NotificationTriggerEnum.feed_items_comment_notification,
              messageVariables: () => [
                {
                  key: 'subject_person',
                  value: 'Christian',
                },
              ],
            }),
          },
        })}
      />,
    ).snapshot();
  });
});

describe('handleNotificationPress', () => {
  it('navigates when notification is pressed', () => {
    const mockNotification = mockFragment<NotificationItem>(
      NOTIFICATION_ITEM_FRAGMENT,
      {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              '<<person_name>> posted a new <<localized_post_type>> in <<community_name>>',
            trigger: () => NotificationTriggerEnum.story_notification,
            messageVariables: () => [
              {
                key: 'localized_post_type',
                value: 'prayer request',
              },
              {
                key: 'post_type_enum',
                value: 'prayer_request',
              },
              {
                key: 'community_name',
                value: 'Bleh 2.0',
              },
              {
                key: 'person_name',
                value: 'Christian Huffman',
              },
            ],
            screenData: {
              feedItemId: '1234',
            },
          }),
        },
      },
    );
    const { getByTestId } = renderWithContext(
      <NotificationCenterItem event={mockNotification} />,
    );

    fireEvent.press(getByTestId('notificationButton'));
    expect(navigatePush).toHaveBeenCalledWith(FEED_ITEM_DETAIL_SCREEN, {
      feedItemId: mockNotification.screenData.feedItemId,
    });
  });

  it('does not navigate if notification is step', () => {
    const { getByTestId } = renderWithContext(
      <NotificationCenterItem
        event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
          mocks: {
            Notification: () => ({
              messageTemplate: () => '<<subject_person>> took a step of faith!',
              trigger: () =>
                NotificationTriggerEnum.feed_items_assigned_to_alert_step,
              messageVariables: () => [
                {
                  key: 'subject_person',
                  value: 'Christian',
                },
              ],
            }),
          },
        })}
      />,
    );

    fireEvent.press(getByTestId('notificationButton'));
    expect(navigatePush).not.toHaveBeenCalled();
  });

  it('does not navigate if notification is challenge', () => {
    const { getByTestId } = renderWithContext(
      <NotificationCenterItem
        event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
          mocks: {
            Notification: () => ({
              messageTemplate: () =>
                'You have a new Challenge in <<community_name>>',
              trigger: () =>
                NotificationTriggerEnum.community_challenge_created_alert,
              messageVariables: () => [
                {
                  key: 'community_name',
                  value: 'Bleh 2.0',
                },
              ],
            }),
          },
        })}
      />,
    );

    fireEvent.press(getByTestId('notificationButton'));
    expect(navigatePush).not.toHaveBeenCalled();
  });
});