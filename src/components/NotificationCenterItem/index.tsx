import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Avatar from '../Avatar';
import { Text, Flex } from '../common';
import DateComponent from '../DateComponent';
import PostTypeLabel, { PostLabelSizeEnum } from '../PostTypeLabel';
import {
  FeedItemSubjectTypeEnum,
  NotificationTriggerEnum,
  PostTypeEnum,
} from '../../../__generated__/globalTypes';
import { NotificationItem } from './__generated__/NotificationItem';
import { mapPostTypeToFeedType } from '../../utils/common';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedItemDetailScreen';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';

const NotificationCenterItem = ({ event }: { event: NotificationItem }) => {
  const { t } = useTranslation('notificationsCenter');
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
                getMessageVariable('subject_person') ||
                  t('profileLabels.aMissionHubUser'),
              )}`}
            </Text>
          );
        case '<<person_name>>':
          return (
            <Text key={word} style={styles.boldedItemText}>
              {`${word.replace(
                /<<person_name>>/,
                getMessageVariable('person_name') ||
                  t('profileLabels.aMissionHubUser'),
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
  const iconType =
    mapPostTypeToFeedType(
      getMessageVariable('post_type_enum') as PostTypeEnum,
    ) || FeedItemSubjectTypeEnum.STORY;

  // const buildReportedMessage = () => (
  //   <>
  //     {renderTemplateMessage()}
  //     <Text style={styles.boldedItemText}>{` ${t('review')}`}</Text>
  //   </>
  // );

  const renderText = () => {
    if (NotificationTriggerEnum[trigger]) {
      return renderTemplateMessage();
    }
  };

  const shouldNavigate = () => {
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
    <Flex style={styles.itemContainer} direction="row" justify="between">
      <Flex
        direction="row"
        justify="between"
        align="center"
        style={{ paddingHorizontal: 20, maxWidth: 350 }}
      >
        <Avatar person={subjectPerson} size="medium" />
        <View style={{ position: 'absolute', top: 30, left: 50 }}>
          <PostTypeLabel
            showText={false}
            size={PostLabelSizeEnum.small}
            type={iconType}
          />
        </View>
        <Flex style={{ paddingHorizontal: 20 }}>
          <Text style={styles.itemText} onPress={handleNotificationPress}>
            {renderText()}
          </Text>
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
