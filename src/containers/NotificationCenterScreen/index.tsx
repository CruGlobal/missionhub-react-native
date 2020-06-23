import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { View, Text, SectionList } from 'react-native';
import { useNavigationEvents } from 'react-navigation-hooks';

import theme from '../../theme';
import Header from '../../components/Header';
import { IconButton, Flex } from '../../components/common';
import {
  NotificationCenterItem,
  ReportedNotificationCenterItem,
} from '../../components/NotificationCenterItem';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { openMainMenu } from '../../utils/common';
import { isLastTwentyFourHours, getMomentDate } from '../../utils/date';
import { NotificationItem } from '../../components/NotificationCenterItem/__generated__/NotificationItem';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ContentComplaintGroupItem } from '../../components/NotificationCenterItem/__generated__/ContentComplaintGroupItem';
import { useFeatureFlags } from '../../utils/hooks/useFeatureFlags';
import RefreshButton from '../../components/RefreshButton';
import { GET_UNREAD_NOTIFICATION_STATUS } from '../../components/TabIcon/queries';
import { GetUnreadNotificationStatus } from '../../components/TabIcon/__generated__/GetUnreadNotificationStatus';

import {
  UpdateLatestNotification,
  UpdateLatestNotificationVariables,
} from './__generated__/UpdateLatestNotification';
import NullNotificationsIcon from './nullNotificationsIcon.svg';
import { GetNotifications } from './__generated__/GetNotifications';
import { GET_NOTIFICATIONS, UPDATE_LATEST_NOTIFICATION } from './queries';
import styles from './styles';

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
      contentComplaints = [],
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
  // When user clicks on notifications tab, refetch notifications
  useNavigationEvents(evts => {
    if (evts.action.type === 'Navigation/JUMP_TO') {
      refetch();
    }
  });

  const {
    data: {
      notifications: { nodes: latestNotification = [] } = {},
      notificationState,
    } = {},
  } = useQuery<GetUnreadNotificationStatus>(GET_UNREAD_NOTIFICATION_STATUS);

  const filteredSections = [
    {
      id: 0,
      name: 'reportedActivity',
      data: contentComplaints,
    },
    {
      id: 1,
      name: 'dates.today',
      data: nodes.filter(n =>
        isLastTwentyFourHours(getMomentDate(n.createdAt)),
      ),
    },
    {
      id: 2,
      name: 'dates.earlier',
      data: nodes.filter(
        n => !isLastTwentyFourHours(getMomentDate(n.createdAt)),
      ),
    },
  ].filter(section => section.data.length > 0);

  const [setHasUnreadNotifications] = useMutation<
    UpdateLatestNotification,
    UpdateLatestNotificationVariables
  >(UPDATE_LATEST_NOTIFICATION);

  const { notifications_panel } = useFeatureFlags();

  const onOpenMainMenu = () => dispatch(openMainMenu());
  const hasNewNotification =
    latestNotification[0]?.createdAt !== notificationState?.lastReadDateTime;

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
    [filteredSections],
  );

  const renderItem = ({
    item,
  }: {
    item: NotificationItem | ContentComplaintGroupItem;
  }) => {
    return item.__typename === 'Notification' ? (
      <NotificationCenterItem event={item} />
    ) : (
      <ReportedNotificationCenterItem event={item} />
    );
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
      {hasNewNotification ? (
        <RefreshButton loading={loading} refresh={refetch} />
      ) : null}
      <SectionList
        testID="notificationCenter"
        style={{
          backgroundColor:
            filteredSections.length === 0 || !notifications_panel
              ? theme.white
              : theme.extraLightGrey,
        }}
        onRefresh={handleRefreshing}
        refreshing={loading}
        onEndReachedThreshold={0.2}
        onEndReached={handleOnEndReached}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderNull}
        sections={notifications_panel ? filteredSections : []}
        renderItem={renderItem}
      />
    </View>
  );
};

export default NotificationCenterScreen;
