import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

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

import { NotificationItem } from './__generated__/NotificationItem';
import styles from './styles';

const NotificationCenterItem = ({ event }: { event: NotificationItem }) => {
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
    const templateArray = messageTemplate.split(/(<<.*?>>)/).filter(Boolean);
    return templateArray.map((word: string) => {
      switch (word) {
        case '<<subject_person>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {getMessageVariable('subject_person') || ''}
            </Text>
          );
        case '<<person_name>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {getMessageVariable('person_name') || ''}
            </Text>
          );
        case '<<localized_post_type>>':
          return (
            <Text key={word}>{getMessageVariable('localized_post_type')}</Text>
          );
        case '<<community_name>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {getMessageVariable('community_name') || ''}
            </Text>
          );
        default:
          return <Text key={word}>{word}</Text>;
      }
    });
  };

  const iconType =
    mapPostTypeToFeedType(
      getMessageVariable('post_type_enum') as PostTypeEnum,
    ) || FeedItemSubjectTypeEnum.STORY;

  const renderIcon = () => {
    // Comments and Challenges don't return a FeedItemSubjectType, so we have to check
    // for them seperately
    switch (trigger) {
      case NotificationTriggerEnum.feed_items_comment_notification:
        return <CommentIcon />;
      case NotificationTriggerEnum.community_challenge_created_alert:
        return (
          <PostTypeLabel
            showText={false}
            size={PostLabelSizeEnum.small}
            type={FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE}
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

  const shouldNavigate = () => {
    // Currently can't handle navigating to challenge and step feed items
    return (
      trigger !== NotificationTriggerEnum.community_challenge_created_alert &&
      trigger !== NotificationTriggerEnum.feed_items_assigned_to_alert_step
    );
  };

  const handleNotificationPress = () => {
    if (trigger !== NotificationTriggerEnum.feed_items_assigned_to_alert_step) {
      switch (trigger) {
        case NotificationTriggerEnum.community_challenge_created_alert:
          return dispatch(
            navigatePush(CHALLENGE_DETAIL_SCREEN, {
              // If no communityId, than it is a global challenge
              orgId: screenData.communityId
                ? screenData.communityId
                : GLOBAL_COMMUNITY_ID,
              challengeId: screenData.challengeId,
            }),
          );
        default:
          return dispatch(
            navigatePush(FEED_ITEM_DETAIL_SCREEN, {
              feedItemId: screenData.feedItemId,
            }),
          );
      }
    }
  };

  return (
    <Touchable
      onPress={handleNotificationPress}
      testID="notificationButton"
      style={styles.itemContainer}
    >
      <View style={styles.contentContainer}>
        <Avatar person={subjectPerson} size="medium" />
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
export default NotificationCenterItem;
