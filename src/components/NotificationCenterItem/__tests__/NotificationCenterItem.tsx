/* eslint max-lines: 0 */

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { navigatePush } from '../../../actions/navigation';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { renderWithContext } from '../../../../testUtils';
import {
  NOTIFICATION_ITEM_FRAGMENT,
  CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
  GET_COMMUNITY_INFO,
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
import { reloadGroupChallengeFeed } from '../../../actions/challenges';
import { NotificationCenterItem, ReportedNotificationCenterItem } from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/challenges');

const communityId = '4';

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
  (reloadGroupChallengeFeed as jest.Mock).mockReturnValue({
    type: 'reload group challenge feed',
  });
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
    const mockNotificationItem = mockFragment<NotificationItem>(
      NOTIFICATION_ITEM_FRAGMENT,
      {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              '<<person_name>> posted a new <<localized_post_type>> in <<community_name>>',
            trigger: () => NotificationTriggerEnum.story_notification,
            screenData: () => ({ communityId: '1234' }),
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
      },
    );
    renderWithContext(
      <NotificationCenterItem event={mockNotificationItem} />,
    ).snapshot();

    expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
      variables: {
        communityId: mockNotificationItem.screenData.communityId,
      },
      fetchPolicy: 'cache-first',
      skip: true,
    });
  }

  it('renders correctly | Prayer Request', () => {
    notificationType('prayer request', PostTypeEnum.prayer_request);
    expect.hasAssertions();
  });
  it('renders correctly | Spiritual Question', () => {
    notificationType('spiritual question', PostTypeEnum.question);
    expect.hasAssertions();
  });
  it('renders correctly | Community Need', () => {
    notificationType('care request', PostTypeEnum.help_request);
    expect.hasAssertions();
  });
  it('renders correctly | God Story', () => {
    notificationType('god story', PostTypeEnum.story);
    expect.hasAssertions();
  });
  it('renders correctly | Thought', () => {
    notificationType('thought', PostTypeEnum.thought);
    expect.hasAssertions();
  });

  it('renders global community post', () => {
    renderWithContext(
      <NotificationCenterItem
        event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
          mocks: {
            Notification: () => ({
              messageTemplate: () =>
                '<<person_name>> posted a new <<localized_post_type>> in <<community_name>>',
              trigger: () => NotificationTriggerEnum.story_notification,
              screenData: () => ({ communityId: '' }),
              messageVariables: () => [
                {
                  key: 'localized_post_type',
                  value: 'god story',
                },
                {
                  key: 'post_type_enum',
                  value: PostTypeEnum.story,
                },
                {
                  key: 'community_name',
                  value: 'MissionHub',
                },
                {
                  key: 'person_name',
                  value: 'MissionHub Team',
                },
              ],
            }),
          },
        })}
      />,
    ).snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
      variables: {
        communityId: '',
      },
      fetchPolicy: 'cache-first',
      skip: true,
    });
  });
  describe('Announcement', () => {
    const mockAnnouncment = mockFragment<NotificationItem>(
      NOTIFICATION_ITEM_FRAGMENT,
      {
        mocks: {
          Notification: () => ({
            screenData: () => ({
              communityId: '1234',
            }),
            messageTemplate: () =>
              '<<community_name>> posted a new announcement.',
            trigger: () => NotificationTriggerEnum.story_notification,
            messageVariables: () => [
              {
                key: 'community_name',
                value: 'Bleh 2.0',
              },
              {
                key: 'post_type_enum',
                value: PostTypeEnum.announcement,
              },
            ],
          }),
        },
      },
    );

    it('renders correctly | Announcement', () => {
      renderWithContext(
        <NotificationCenterItem event={mockAnnouncment} />,
      ).snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
        variables: {
          communityId: mockAnnouncment.screenData.communityId,
        },
        fetchPolicy: 'cache-first',
        skip: false,
      });
    });

    it('renders with default community avatar', () => {
      renderWithContext(<NotificationCenterItem event={mockAnnouncment} />, {
        mocks: {
          Community: () => ({
            communityPhotoUrl: null,
          }),
        },
      }).snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
        variables: {
          communityId: mockAnnouncment.screenData.communityId,
        },
        fetchPolicy: 'cache-first',
        skip: false,
      });
    });

    it('renders global community avatar', () => {
      renderWithContext(
        <NotificationCenterItem
          event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
            mocks: {
              Notification: () => ({
                screenData: () => ({
                  communityId: '',
                }),
                messageTemplate: () =>
                  '<<community_name>> posted a new announcement.',
                trigger: () => NotificationTriggerEnum.new_announcement_post,
                messageVariables: () => [
                  {
                    key: 'community_name',
                    value: 'MissionHub',
                  },
                  {
                    key: 'post_type_enum',
                    value: PostTypeEnum.announcement,
                  },
                ],
              }),
            },
          })}
        />,
      ).snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
        variables: {
          communityId: '',
        },
        fetchPolicy: 'cache-first',
        skip: true,
      });
    });
  });

  describe('Comunity Challenge', () => {
    const mockCommunityChallenge = mockFragment<NotificationItem>(
      NOTIFICATION_ITEM_FRAGMENT,
      {
        mocks: {
          Notification: () => ({
            screenData: () => ({
              communityId: '1234',
            }),
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
      },
    );
    it('renders correctly | Community Challenge', () => {
      renderWithContext(
        <NotificationCenterItem event={mockCommunityChallenge} />,
      ).snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
        variables: {
          communityId: mockCommunityChallenge.screenData.communityId,
        },
        fetchPolicy: 'cache-first',
        skip: false,
      });
    });
    it('renders with default community avatar', () => {
      renderWithContext(
        <NotificationCenterItem event={mockCommunityChallenge} />,
        {
          mocks: {
            Community: () => ({
              communityPhotoUrl: null,
            }),
          },
        },
      ).snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
        variables: {
          communityId: mockCommunityChallenge.screenData.communityId,
        },
        fetchPolicy: 'cache-first',
        skip: false,
      });
    });

    it('renders global community avatar', () => {
      renderWithContext(
        <NotificationCenterItem
          event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
            mocks: {
              Notification: () => ({
                screenData: () => ({
                  communityId: '',
                }),
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
      expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_INFO, {
        variables: {
          communityId: '',
        },
        fetchPolicy: 'cache-first',
        skip: true,
      });
    });
  });

  it('renders correctly | Comment 1', () => {
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

it('renders correctly | Comment 2', () => {
  renderWithContext(
    <NotificationCenterItem
      event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              '<<subject_person>> commented on your <<localized_post_type>> in <<community_name>>.',
            trigger: () =>
              NotificationTriggerEnum.feed_items_comment_on_my_feed_item_notification,
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

it('renders correctly | Comment 3', () => {
  renderWithContext(
    <NotificationCenterItem
      event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              "<<subject_person>> also commented on <<original_poster>>'s <<localized_post_type>> in <<community_name>>.",
            trigger: () =>
              NotificationTriggerEnum.feed_items_comment_on_other_persons_post_notification,
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

it('renders correctly | Comment 4', () => {
  renderWithContext(
    <NotificationCenterItem
      event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              '<<subject_person>> commented on your <<localized_post_type>> in <<community_name>>.',
            trigger: () =>
              NotificationTriggerEnum.feed_items_comment_on_my_post_notification,
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

it('renders correctly | Comment 5', () => {
  renderWithContext(
    <NotificationCenterItem
      event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              '<<subject_person>> commented on your <<localized_feed_item>> in <<community_name>>.',
            trigger: () =>
              NotificationTriggerEnum.feed_items_comment_on_my_feed_item_notification,
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
                key: 'localized_feed_item',
                value: 'step of faith',
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
      fromNotificationCenterItem: true,
      feedItemId: mockNotification.screenData.feedItemId,
    });
  });

  it('navigates to challenge detail screen', async () => {
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

    const communityName = 'Test';
    const { getByTestId } = renderWithContext(
      <NotificationCenterItem event={mockChallengeNotification} />,
      { mocks: { Community: () => ({ name: communityName }) } },
    );
    await flushMicrotasksQueue();

    await fireEvent.press(getByTestId('notificationButton'));
    expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(
      mockChallengeNotification.screenData.communityId,
    );
    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      communityName,
      fromNotificationCenterItem: true,
      orgId: mockChallengeNotification.screenData.communityId,
      challengeId: mockChallengeNotification.screenData.challengeId,
    });
  });

  it('navigates to global community challenge detail screen if no communityId', async () => {
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
      { mocks: { Community: () => ({ name: '' }) } },
    );
    await flushMicrotasksQueue();

    await fireEvent.press(getByTestId('notificationButton'));
    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      communityName: '',
      fromNotificationCenterItem: true,
      orgId: GLOBAL_COMMUNITY_ID,
      challengeId: mockChallengeNotification.screenData.challengeId,
    });
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
