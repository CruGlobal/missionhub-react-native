import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { View, Text, SectionList } from 'react-native';

import theme from '../../theme';
import Header from '../../components/Header';
import { IconButton, Flex } from '../../components/common';
import NotificationCenterItem from '../../components/NotificationCenterItem';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { openMainMenu } from '../../utils/common';
import { isLastTwentyFourHours, getMomentDate } from '../../utils/date';
import { NotificationItem } from '../../components/NotificationCenterItem/__generated__/NotificationItem';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
// import { GET_UNREAD_NOTIFICATION_STATUS } from '../../components/TabIcon/queries';
// import { GetUnreadNotificationStatus } from '../../components/TabIcon/__generated__/GetUnreadNotificationStatus';

import {
  UpdateLatestNotification,
  UpdateLatestNotificationVariables,
} from './__generated__/UpdateLatestNotification';
import NullNotificationsIcon from './nullNotificationsIcon.svg';
import { GetNotifications } from './__generated__/GetNotifications';
import { GET_NOTIFICATIONS, UPDATE_LATEST_NOTIFICATION } from './queries';
import styles from './styles';

interface SectionsInterface {
  id: number;
  name: string;
  data: NotificationItem[];
}
const groupNotificationFeed = (nodes: NotificationItem[]) => {
  const sections: SectionsInterface[] = [
    { id: 0, name: 'reportedActivity', data: [] },
    { id: 1, name: 'dates.today', data: [] },
    { id: 2, name: 'dates.earlier', data: [] },
  ];

  return nodes
    .reduce((acc, c) => {
      if (isLastTwentyFourHours(getMomentDate(c.createdAt))) {
        acc[1].data.push(c);
      } else {
        acc[2].data.push(c);
      }

      return [...acc];
    }, sections)
    .filter(section => section.data.length > 0);
};

const NotificationCenterScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('notificationsCenter');

  useAnalytics('notification center');

  const {
    data: {
      notifications: {
        nodes = [],
        pageInfo: { endCursor = null, hasNextPage = false } = {},
      } = {},
    } = {},
    refetch,
    fetchMore,
    loading,
    error,
  } = useQuery<GetNotifications>(GET_NOTIFICATIONS, {
    onCompleted: data => {
      // Update local cache with newest notification time stamp after user refreshes
      if (data.notifications.nodes[0]) {
        setHasUnreadNotifications({
          variables: {
            latestNotification: data.notifications.nodes[0].createdAt,
          },
        });
      }
    },
  });

  // TODO Connect a refresh button
  // const {
  //   data: {
  //     notifications: { nodes: latestNotification = [] } = {},
  //     notificationState,
  //   } = {},
  // } = useQuery<GetUnreadNotificationStatus>(GET_UNREAD_NOTIFICATION_STATUS);

  const [setHasUnreadNotifications] = useMutation<
    UpdateLatestNotification,
    UpdateLatestNotificationVariables
  >(UPDATE_LATEST_NOTIFICATION);

  const onOpenMainMenu = () => dispatch(openMainMenu());
  // const hasNewNotification =
  //   latestNotification[0].createdAt !== notificationState?.lastReadDateTime;

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

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return <NotificationCenterItem event={item} />;
  };
  const handleRefreshing = () => {
    if (loading) {
      return;
    }
    refetch();
  };

  const handleOnEndReached = () => {
    if (loading || error || !hasNextPage) {
      return;
    }

    fetchMore({
      variables: {
        notificationCursor: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              notifications: {
                ...prev.notifications,
                ...fetchMoreResult.notifications,
                nodes: [
                  ...(prev.notifications.nodes || []),
                  ...(fetchMoreResult.notifications.nodes || []),
                ],
              },
            }
          : prev,
    });
  };

  const filteredSections = groupNotificationFeed(nodes);

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
        title={t('title')}
        titleStyle={styles.title}
      />
      <ErrorNotice
        error={error}
        message={t('errorLoadingNotifications')}
        refetch={refetch}
      />
      <SectionList
        testID="notificationCenter"
        style={{
          backgroundColor:
            filteredSections.length === 0 ? theme.white : theme.extraLightGrey,
        }}
        onRefresh={handleRefreshing}
        refreshing={loading}
        onEndReachedThreshold={0.2}
        onEndReached={handleOnEndReached}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderNull}
        sections={filteredSections}
        renderItem={renderItem}
      />
    </View>
  );
};

export default NotificationCenterScreen;
