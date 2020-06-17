/* eslint max-lines: 0 */

import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { navigatePush } from '../../../actions/navigation';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { renderWithContext } from '../../../../testUtils';
import {
  NOTIFICATION_ITEM_FRAGMENT,
  CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
} from '../queries';
import { NotificationItem } from '../__generated__/NotificationItem';
import { FEED_ITEM_DETAIL_SCREEN } from '../../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import {
  NotificationTriggerEnum,
  PostTypeEnum,
} from '../.../../../../../__generated__/globalTypes';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { ContentComplaintGroupItem } from '../__generated__/ContentComplaintGroupItem';
import { COMMUNITY_REPORTED } from '../../../containers/Communities/Community/CommunityReported/CommunityReported';

import { NotificationCenterItem, ReportedNotificationCenterItem } from '..';

jest.mock('../../../actions/navigation');

const communityId = '4';

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
                "<<subject_person>> commented on <<original_poster>>'s <<localized_post_type>> in <<community_name>>.",
              trigger: () =>
                NotificationTriggerEnum.feed_items_comment_notification,
              messageVariables: () => [
                {
                  key: 'subject_person',
                  value: 'Christian',
                },
                {
                  key: 'original_poster',
                  value: 'Scotty',
                },
                {
                  key: 'localized_post_type',
                  value: 'prayer request',
                },
                {
                  key: 'community_name',
                  value: 'Bleh',
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
              communityId,
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
      communityId,
    });
  });

  it('navigates to challenge detail screen', () => {
    const mockChallengeNotification = mockFragment<NotificationItem>(
      NOTIFICATION_ITEM_FRAGMENT,
      {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              'You have a new Challenge from <<community_name>>',
            trigger: () =>
              NotificationTriggerEnum.community_challenge_created_alert,
            messageVariables: () => [
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
              communityId: '1234',
              challengeId: '4321',
            },
          }),
        },
      },
    );
    const { getByTestId } = renderWithContext(
      <NotificationCenterItem event={mockChallengeNotification} />,
    );

    fireEvent.press(getByTestId('notificationButton'));
    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      orgId: mockChallengeNotification.screenData.communityId,
      challengeId: mockChallengeNotification.screenData.challengeId,
    });
  });

  it('navigates to global community challenge detail screen if no communityId', () => {
    const mockChallengeNotification = mockFragment<NotificationItem>(
      NOTIFICATION_ITEM_FRAGMENT,
      {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              'You have a new Challenge from <<community_name>>',
            trigger: () =>
              NotificationTriggerEnum.community_challenge_created_alert,
            messageVariables: () => [
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
              communityId: null,
              challengeId: '4321',
            },
          }),
        },
      },
    );
    const { getByTestId } = renderWithContext(
      <NotificationCenterItem event={mockChallengeNotification} />,
    );

    fireEvent.press(getByTestId('notificationButton'));
    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      orgId: GLOBAL_COMMUNITY_ID,
      challengeId: mockChallengeNotification.screenData.challengeId,
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
});

describe('ReportedNotificationItem', () => {
  it('renders correctly | Reported Post', () => {
    renderWithContext(
      <ReportedNotificationCenterItem
        event={mockFragment<ContentComplaintGroupItem>(
          CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
          {
            mocks: {
              ContentComplaintGroup: () => ({
                subject: () => ({
                  __typename: 'Post',
                }),
              }),
            },
          },
        )}
      />,
    ).snapshot();
  });

  it('renders correctly | Reported Comment', () => {
    renderWithContext(
      <ReportedNotificationCenterItem
        event={mockFragment<ContentComplaintGroupItem>(
          CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
          {
            mocks: {
              ContentComplaintGroup: () => ({
                subject: () => ({
                  __typename: 'FeedItemComment',
                }),
              }),
            },
          },
        )}
      />,
    ).snapshot();
  });

  it('renders correctly | without community photo', () => {
    renderWithContext(
      <ReportedNotificationCenterItem
        event={mockFragment<ContentComplaintGroupItem>(
          CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
          {
            mocks: {
              ContentComplaintGroup: () => ({
                subject: () => ({
                  __typename: 'Post',
                  feedItem: {
                    community: {
                      communityPhotoUrl: null,
                    },
                  },
                }),
              }),
            },
          },
        )}
      />,
    ).snapshot();
  });

  it('navigates to CommunityReportedScreen | Post', () => {
    const mockReportedPost = mockFragment<ContentComplaintGroupItem>(
      CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
      {
        mocks: {
          ContentComplaintGroup: () => ({
            subject: () => ({
              __typename: 'Post',
            }),
          }),
        },
      },
    );
    const { getByTestId } = renderWithContext(
      <ReportedNotificationCenterItem event={mockReportedPost} />,
    );

    fireEvent.press(getByTestId('reportedNotificationButton'));
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_REPORTED, {
      reportedItemId: mockReportedPost.id,
    });
  });

  it('navigates to CommunityReportedScreen | Comment', () => {
    const mockReportedComment = mockFragment<ContentComplaintGroupItem>(
      CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
      {
        mocks: {
          ContentComplaintGroup: () => ({
            subject: () => ({
              __typename: 'FeedItemComment',
            }),
          }),
        },
      },
    );
    const { getByTestId } = renderWithContext(
      <ReportedNotificationCenterItem event={mockReportedComment} />,
    );

    fireEvent.press(getByTestId('reportedNotificationButton'));
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_REPORTED, {
      reportedItemId: mockReportedComment.id,
    });
  });
});
