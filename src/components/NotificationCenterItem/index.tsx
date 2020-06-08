import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import Avatar from '../Avatar';
import { Text, Flex, Touchable } from '../common';
import DateComponent from '../DateComponent';
import PostTypeLabel, { PostLabelSizeEnum } from '../PostTypeLabel';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedItemDetailScreen';
import CommentIcon from '../../../assets/images/commentIcon.svg';
import {
  FeedItemSubjectTypeEnum,
  NotificationTriggerEnum,
  PostTypeEnum,
} from '../../../__generated__/globalTypes';
import { navigatePush } from '../../actions/navigation';
import { mapPostTypeToFeedType } from '../../utils/common';

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

  const renderTemplateMessage = () => {
    const templateArray = messageTemplate.split(/(<<.*?>>)/).filter(Boolean);
    return templateArray.map((word: string) => {
      switch (word) {
        case '<<subject_person>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {`${word.replace(
                /<<subject_person>>/,
                getMessageVariable('subject_person') || '',
              )}`}
            </Text>
          );
        case '<<person_name>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {`${word.replace(
                /<<person_name>>/,
                getMessageVariable('person_name') || '',
              )}`}
            </Text>
          );
        case '<<localized_post_type>>':
          return (
            <Text key={word}>{getMessageVariable('localized_post_type')}</Text>
          );
        case '<<community_name>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {`${word.replace(
                /<<community_name>>/,
                getMessageVariable('community_name') || '',
              )}`}
            </Text>
          );
        default:
          return <Text key={word}>{word}</Text>;
      }
    });
  };

  const renderText = () => {
    if (NotificationTriggerEnum[trigger]) {
      return renderTemplateMessage();
    }
  };

  const iconType =
    mapPostTypeToFeedType(
      getMessageVariable('post_type_enum') as PostTypeEnum,
    ) || FeedItemSubjectTypeEnum.STORY;

  const renderIcon = () => {
    // Comments and Challenges don't return a FeedItemSubjectType, so we have to check
    // for them seperately
    if (
      [
        NotificationTriggerEnum.feed_items_comment_notification,
        NotificationTriggerEnum.community_challenge_created_alert,
      ].includes(trigger)
    ) {
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
      }
    } else {
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
    if (shouldNavigate()) {
      dispatch(
        navigatePush(FEED_ITEM_DETAIL_SCREEN, {
          feedItemId: screenData.feedItemId,
        }),
      );
    }
  };

  return (
    <Touchable onPress={handleNotificationPress} testID="notificationButton">
      <Flex style={styles.itemContainer} direction="row" justify="between">
        <Flex
          direction="row"
          justify="between"
          align="center"
          style={{ paddingHorizontal: 20, maxWidth: 350 }}
        >
          <Avatar person={subjectPerson} size="medium" />
          <View style={{ position: 'absolute', top: 30, left: 50 }}>
            {renderIcon()}
          </View>
          <Flex style={{ paddingHorizontal: 20 }}>
            <Text style={styles.itemText}>{renderText()}</Text>
            <DateComponent
              style={styles.dateText}
              date={createdAt}
              format={'LLL'}
            />
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  );
};
export default NotificationCenterItem;
