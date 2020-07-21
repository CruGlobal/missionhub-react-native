import React from 'react';
import { View, Image } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Avatar from '../Avatar';
import { Text, Touchable } from '../common';
import DateComponent from '../DateComponent';
import PostTypeLabel, { PostLabelSizeEnum } from '../PostTypeLabel';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import CommentIcon from '../../../assets/images/commentIcon.svg';
import {
  FeedItemSubjectTypeEnum,
  NotificationTriggerEnum,
  PostTypeEnum,
} from '../../../__generated__/globalTypes';
import { navigatePush } from '../../actions/navigation';
import { mapPostTypeToFeedType } from '../../utils/common';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import { COMMUNITY_REPORTED } from '../../containers/Communities/Community/CommunityReported/CommunityReported';
import DefaultCommunityAvatar from '../../../assets/images/defaultCommunityAvatar.svg';
import { reloadGroupChallengeFeed } from '../../actions/challenges';

import { ContentComplaintGroupItem } from './__generated__/ContentComplaintGroupItem';
import ReportedIcon from './reportedIcon.svg';
import { NotificationItem } from './__generated__/NotificationItem';
import styles from './styles';
import { GET_COMMUNITY_PHOTO } from './queries';
import {
  GetCommunityPhoto,
  GetCommunityPhotoVariables,
} from './__generated__/GetCommunityPhoto';

export const NotificationCenterItem = ({
  event,
}: {
  event: NotificationItem;
}) => {
  const dispatch = useDispatch();
  const {
    messageTemplate,
    messageVariables,
    subjectPerson,
    trigger,
    createdAt,
    screenData,
  } = event;

  const getMessageVariable = (variable: string) => {
    return messageVariables.find(i => i.key === variable)?.value;
  };

  const renderNotificationTemplateMessage = () => {
    enum BoldedMessageVariableEnum {
      'subject_person',
      'person_name',
      'community_name',
      'original_poster',
    }
    const templateArray = messageTemplate.split(/(<<.*?>>)/).filter(Boolean);
    return templateArray.map((word: string) => {
      const filteredWord = word.replace(/[^a-zA-Z _]/g, '');
      return word.match(/[<>]+/g) ? (
        Object.values(BoldedMessageVariableEnum).includes(filteredWord) ? (
          <Text style={styles.boldedItemText}>
            {getMessageVariable(filteredWord)}
          </Text>
        ) : (
          <Text style={styles.itemText}>
            {getMessageVariable(filteredWord)}
          </Text>
        )
      ) : (
        <Text key={word}>{word}</Text>
      );
    });
  };

  const iconType =
    mapPostTypeToFeedType(
      getMessageVariable('post_type_enum') as PostTypeEnum,
    ) || FeedItemSubjectTypeEnum.STORY;

  // Only query for community photo if notification is a challenge created or an announcment post
  const shouldSkip = !(
    trigger === NotificationTriggerEnum.community_challenge_created_alert ||
    (trigger === NotificationTriggerEnum.story_notification &&
      iconType === FeedItemSubjectTypeEnum.ANNOUNCEMENT)
  );

  const {
    data: { community: { communityPhotoUrl = null } = {} } = {},
  } = useQuery<GetCommunityPhoto, GetCommunityPhotoVariables>(
    GET_COMMUNITY_PHOTO,
    {
      fetchPolicy: 'cache-first',
      variables: {
        communityId: screenData.communityId || '',
      },

      skip: shouldSkip,
    },
  );

  const renderIcon = () => {
    // Comments and Challenges don't return a FeedItemSubjectType, so we have to check
    // for them seperately
    switch (trigger) {
      case NotificationTriggerEnum.feed_items_comment_notification:
      case NotificationTriggerEnum.feed_items_comment_on_my_post_notification:
      case NotificationTriggerEnum.feed_items_comment_on_my_feed_item_notification:
      case NotificationTriggerEnum.feed_items_comment_on_other_persons_post_notification:
        return <CommentIcon />;
      case NotificationTriggerEnum.community_challenge_created_alert:
        return (
          <PostTypeLabel
            showText={false}
            size={PostLabelSizeEnum.small}
            type={FeedItemSubjectTypeEnum.ACCEPTED_COMMUNITY_CHALLENGE}
          />
        );
      default:
        return (
          <PostTypeLabel
            showText={false}
            size={PostLabelSizeEnum.small}
            type={iconType}
          />
        );
    }
  };

  const handleNotificationPress = async () => {
    switch (trigger) {
      case NotificationTriggerEnum.community_challenge_created_alert: {
        const communityId = screenData.communityId
          ? screenData.communityId
          : GLOBAL_COMMUNITY_ID;

        await dispatch(reloadGroupChallengeFeed(communityId));
        return dispatch(
          navigatePush(CHALLENGE_DETAIL_SCREEN, {
            // If no communityId, than it is a global challenge
            orgId: communityId,
            challengeId: screenData.challengeId,
          }),
        );
      }
      default:
        return dispatch(
          navigatePush(FEED_ITEM_DETAIL_SCREEN, {
            fromNotificationCenterItem: true,
            feedItemId: screenData.feedItemId,
          }),
        );
    }
  };

  const renderAvatar = () => {
    switch (trigger) {
      case NotificationTriggerEnum.community_challenge_created_alert:
        return communityPhotoUrl ? (
          <Image
            source={{ uri: communityPhotoUrl }}
            style={styles.wrapStyle}
            resizeMode="cover"
          />
        ) : (
          <DefaultCommunityAvatar />
        );
      case NotificationTriggerEnum.story_notification:
        return iconType === FeedItemSubjectTypeEnum.ANNOUNCEMENT ? (
          communityPhotoUrl ? (
            <Image
              source={{ uri: communityPhotoUrl }}
              style={styles.wrapStyle}
              resizeMode="cover"
            />
          ) : (
            <DefaultCommunityAvatar />
          )
        ) : (
          <Avatar person={subjectPerson ?? undefined} size="medium" />
        );
      default:
        return <Avatar person={subjectPerson ?? undefined} size="medium" />;
    }
  };

  return (
    <Touchable
      onPress={handleNotificationPress}
      testID="notificationButton"
      style={styles.itemContainer}
    >
      <View style={styles.contentContainer}>
        {renderAvatar()}
        <View style={{ position: 'absolute', top: 30, left: 50 }}>
          {renderIcon()}
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.itemText}>
            {renderNotificationTemplateMessage()}
          </Text>
          <DateComponent
            style={styles.dateText}
            date={createdAt}
            format={'LLL'}
          />
        </View>
      </View>
    </Touchable>
  );
};

export const ReportedNotificationCenterItem = ({
  event,
}: {
  event: ContentComplaintGroupItem;
}) => {
  const { t } = useTranslation('notificationsCenter');
  const dispatch = useDispatch();

  const handleNotificationPress = () => {
    dispatch(
      navigatePush(COMMUNITY_REPORTED, {
        reportedItemId: event.id,
      }),
    );
  };
  const eventSubject = event.subject;
  if (
    eventSubject.__typename !== 'Post' &&
    eventSubject.__typename !== 'FeedItemComment'
  ) {
    throw new Error(
      'Subject type of ReportedItem passed to ReportedNotificationCenterItem must be either a Post or FeedItemComment',
    );
  }
  const communityPhoto = eventSubject.feedItem?.community?.communityPhotoUrl;
  const communityName = eventSubject.feedItem?.community?.name;

  const renderReportedMessage = () => {
    switch (event.subject.__typename) {
      case 'FeedItemComment':
        return (
          <>
            <Text>{t('reportedComment.part1')}</Text>
            <Text style={styles.boldedItemText}>{` ${communityName} `}</Text>
            <Text>{t('reportedComment.part2')}</Text>
            <Text style={styles.boldedItemText}>{` ${t('review')}`}</Text>
          </>
        );
      case 'Post':
        return (
          <>
            <Text>{t('reportedPost.part1')}</Text>
            <Text style={styles.boldedItemText}>{` ${communityName} `}</Text>
            <Text>{t('reportedPost.part2')}</Text>
            <Text style={styles.boldedItemText}>{` ${t('review')}`}</Text>
          </>
        );
    }
  };

  return (
    <Touchable
      onPress={handleNotificationPress}
      testID="reportedNotificationButton"
      style={styles.itemContainer}
    >
      <View style={styles.contentContainer}>
        {communityPhoto ? (
          <Image
            source={{ uri: communityPhoto }}
            style={styles.wrapStyle}
            resizeMode="cover"
          />
        ) : (
          <DefaultCommunityAvatar />
        )}
        <View style={{ position: 'absolute', top: 30, left: 50 }}>
          <ReportedIcon width={24} height={24} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.itemText}>{renderReportedMessage()}</Text>
          <DateComponent
            style={styles.dateText}
            date={eventSubject.createdAt}
            format={'LLL'}
          />
        </View>
      </View>
    </Touchable>
  );
};
