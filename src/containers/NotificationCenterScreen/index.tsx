import React, { useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View, SectionList } from 'react-native';
import moment from 'moment';

import Header from '../../components/Header';
import { IconButton, Text, Flex } from '../../components/common';
import { openMainMenu } from '../../utils/common';
import SettingsIcon from '../../../assets/images/settingsIcon.svg';
import NotificationCenterItem from '../../components/NotificationsCenterItem';
import NullNotificationsIcon from './nullNotificationsIcon.svg';
import { GET_NOTIFICATIONS } from './queries';
import { getMomentDate, isLastTwelveHours } from '../../utils/date';
import {
  GetNotifications,
  GetNotifications_notifications_nodes as NotificationType,
} from './__generated__/GetNotifications';
import theme from '../../theme';

import styles from './styles';

interface SectionsInterface {
  id: number;
  name: string;
  data: NotificationType[];
}

const sortNotificationFeed = (nodes: NotificationType[]) => {
  const sections: SectionsInterface[] = [
    { id: 0, name: 'reportedActivity', data: [] },
    { id: 1, name: 'dates.today', data: [] },
    { id: 2, name: 'dates.earlier', data: [] },
  ];

  nodes.map(notification => {
    if (isLastTwelveHours(getMomentDate(notification.createdAt))) {
      sections[1].data.push(notification);
    } else {
      sections[2].data.push(notification);
    }
  });

  const filteredSection = sections.filter(section => section.data.length > 0);

  return filteredSection;
};

const NotificationCenterScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('notificationsCenter');
  const onOpenMainMenu = () => dispatch(openMainMenu());

  const { data: { notifications: { nodes = [] } = {} } = {} } = useQuery<
    GetNotifications
  >(GET_NOTIFICATIONS, { pollInterval: 30000 });

  const renderNull = () => (
    <Flex justify="center" align="center" style={{ marginTop: '50%' }}>
      <View style={styles.nullContainer}>
        <NullNotificationsIcon color={theme.grey} />
      </View>
      <Text style={styles.nullTitle}>{t('nullTitle')}</Text>
      <Text style={styles.nullText}>{t('nullDescription')}</Text>
    </Flex>
  );

  const openSettingMenu = () => {
    // TODO Add functionality for settings
  };

  const renderItem = ({ item }: { item: NotificationType }) => {
    return <NotificationCenterItem event={item} />;
  };

  const filteredSection = sortNotificationFeed(nodes);

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{t(`${section.name}`)}</Text>
      </View>
    ),
    [],
  );
  return (
    <View style={styles.pageContainer}>
      <Header
        testID="header"
        left={
          <IconButton
            name="menuIcon"
            type="MissionHub"
            onPress={onOpenMainMenu}
          />
        }
        right={
          <SettingsIcon
            color={theme.white}
            style={{ marginRight: 10 }}
            onPress={openSettingMenu}
          />
        }
        title={t('title')}
        titleStyle={styles.title}
      />

      <SectionList
        style={{
          backgroundColor:
            filteredSection.length === 0 ? theme.white : theme.extraLightGrey,
        }}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderNull}
        sections={filteredSection}
        renderItem={renderItem}
      />
    </View>
  );
};

export default NotificationCenterScreen;
