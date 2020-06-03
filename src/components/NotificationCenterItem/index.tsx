import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Avatar from '../Avatar';
import { Text, Flex } from '../common';
import DateComponent from '../DateComponent';
import PostTypeLabel, { PostLabelSizeEnum } from '../PostTypeLabel';
import {
  FeedItemSubjectTypeEnum,
  NotificationTriggerEnum,
} from '../../../__generated__/globalTypes';
import { NotificationItem } from './__generated__/NotificationItem';
import { mapPostTypeToFeedType } from '../../utils/common';

import styles from './styles';

const NotificationCenterItem = ({ event }: { event: NotificationItem }) => {
  const { t } = useTranslation('notificationsCenter');
  const {
    messageTemplate,
    messageVariables,
    subjectPerson,
    trigger,
    createdAt,
  } = event;

  const renderTemplateMessage = () => {
    const templateArray = messageTemplate.split(/(<<.*?>>)/).filter(Boolean);
    return templateArray.map((word: string) => {
      switch (word) {
        case '<<subject_person>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {`${word.replace(
                /<<subject_person>>/,
                messageVariables.subjectPerson ||
                  t('profileLabels.aMissionHubUser'),
              )}`}
            </Text>
          );
        case '<<post_type>>':
          return <Text key={word}>{t(`${messageVariables.postType}`)}</Text>;
        case '<<community_name>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {`${word.replace(
                /<<community_name>>/,
                messageVariables.communityName || '',
              )}`}
            </Text>
          );
        default:
          return <Text key={word}>{word}</Text>;
      }
    });
  };
  const iconType =
    (messageVariables.postType &&
      mapPostTypeToFeedType(messageVariables.postType)) ||
    FeedItemSubjectTypeEnum.STORY;

  // const buildReportedMessage = () => (
  //   <>
  //     {renderTemplateMessage()}
  //     <Text style={styles.boldedItemText}>{` ${t('review')}`}</Text>
  //   </>
  // );

  const renderText = () => {
    switch (trigger) {
      case NotificationTriggerEnum.story_notification:
      case NotificationTriggerEnum.community_challenge_created_alert:
      case NotificationTriggerEnum.feed_items_comment_notification:
        return renderTemplateMessage();
    }
  };
  return (
    <Flex style={styles.itemContainer} direction="row" justify="between">
      <Flex
        direction="row"
        justify="between"
        align="center"
        style={{ paddingHorizontal: 20, maxWidth: 350 }}
      >
        <Avatar person={subjectPerson} size="medium" />
        <View style={{ position: 'absolute', top: 25, left: 50 }}>
          <PostTypeLabel
            showText={false}
            size={PostLabelSizeEnum.small}
            type={iconType}
          />
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
  );
};
export default NotificationCenterItem;
