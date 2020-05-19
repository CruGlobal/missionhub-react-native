import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Avatar from '../Avatar';
import { Text, Flex } from '../common';
import DateComponent from '../DateComponent';
import PostTypeLabel, { PostLabelSizeEnum } from '../PostTypeLabel';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { GetNotifications_notifications_nodes as Notification } from '../../containers/NotificationCenterScreen/__generated__/GetNotifications';

import styles from './styles';

const NotificationCenterItem = ({ event }: { event: Notification }) => {
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
            <Text style={styles.boldedItemText}>
              {`${word.replace(
                /<<subject_person>>/,
                messageVariables.subjectPerson ||
                  t('profileLabels.aMissionHubUser'),
              )}`}
            </Text>
          );
        case '<<post_type>>':
          return <Text>{t(`${messageVariables.postType}`)}</Text>;

        case '<<organization_name>>':
          return (
            <Text style={styles.boldedItemText}>
              {`${word.replace(
                /<<organization_name>>/,
                messageVariables.organizationName || '',
              )}`}
            </Text>
          );

        case '<<reported_type>>':
          return (
            //TODO Get from reported content query
            <Text>
              {` ${word.replace(
                /<<reported_type>>/,
                messageVariables.reported_type || '',
              )}`}
            </Text>
          );
        default:
          return <Text>{word}</Text>;
      }
    });
  };

  const iconType = trigger === 'post' ? messageVariables.postType : trigger;

  const buildReportedMessage = () => (
    <>
      {renderTemplateMessage()}
      <Text style={styles.boldedItemText}>{` ${t('review')}`}</Text>
    </>
  );

  const renderText = () => {
    switch (trigger) {
      case 'post':
      case 'comment':
      case 'story_notification':
      case FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE:
        return renderTemplateMessage();
      case 'reported':
        return buildReportedMessage();
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
