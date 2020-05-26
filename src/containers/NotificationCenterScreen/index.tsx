import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { View, Text, SectionList } from 'react-native';

import theme from '../../theme';
import Header from '../../components/Header';
import { IconButton, Flex } from '../../components/common';
import NotificationCenterItem from '../../components/NotificationCenterItem';
import { openMainMenu } from '../../utils/common';
import SettingsIcon from '../../../assets/images/settingsIcon.svg';
import { isLastTwentyFourHours, getMomentDate } from '../../utils/date';

import { GET_NOTIFICATIONS } from './queries';
import NullNotificationsIcon from './nullNotificationsIcon.svg';
import {
  GetNotifications,
  GetNotifications_notifications_nodes,
} from './__generated__/GetNotifications';
import styles from './styles';

interface SectionsInterface {
  id: number;
  name: string;
  data: GetNotifications_notifications_nodes[];
}
const sortNotificationFeed = (
  nodes: GetNotifications_notifications_nodes[],
) => {
  const sections: SectionsInterface[] = [
    { id: 0, name: 'reportedActivity', data: [] },
    { id: 1, name: 'dates.today', data: [] },
    { id: 2, name: 'dates.earlier', data: [] },
  ];
  nodes.map(notification => {
    if (isLastTwentyFourHours(getMomentDate(notification.createdAt))) {
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
  const {
    data: { notifications: { nodes = [] } = {} } = {},
    refetch,
    loading,
  } = useQuery<GetNotifications>(GET_NOTIFICATIONS);

  const onOpenMainMenu = () => dispatch(openMainMenu());

  const renderNull = () => (
    <Flex justify="center" align="center" style={{ marginTop: '50%' }}>
      <View style={styles.nullContainer}>
        <NullNotificationsIcon color={theme.grey} />
      </View>
      <Text style={styles.nullTitle}>{t('nullTitle')}</Text>
      <Text style={styles.nullText}>{t('nullDescription')}</Text>
    </Flex>
  );
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{t(`${section.name}`)}</Text>
      </View>
    ),
    [],
  );

  const renderItem = ({
    item,
  }: {
    item: GetNotifications_notifications_nodes;
  }) => {
    return <NotificationCenterItem event={item} />;
  };

  const filteredSection = sortNotificationFeed(nodes);

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
        right={<SettingsIcon color={theme.white} style={{ marginRight: 10 }} />}
        title={t('title')}
        titleStyle={styles.title}
      />

      <SectionList
        style={{
          backgroundColor:
            filteredSection.length === 0 ? theme.white : theme.extraLightGrey,
        }}
        onRefresh={refetch}
        refreshing={loading}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderNull}
        sections={filteredSection}
        renderItem={renderItem}
      />
    </View>
  );
};

export default NotificationCenterScreen;
