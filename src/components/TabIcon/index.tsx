import React from 'react';
import i18next from 'i18next';
import { useQuery } from '@apollo/react-hooks';

import Flex from '../Flex';
import { Text } from '../common';
import { isAndroid } from '../../utils/common';
import PeopleIcon from '../../../assets/images/mainNav/peopleIcon.svg';
import StepsIcon from '../../../assets/images/mainNav/stepsIcon.svg';
import CommunitiesIcon from '../../../assets/images/mainNav/communitiesIcon.svg';
import NotificationsIcon from '../../../assets/images/mainNav/notificationsIcon.svg';

import styles from './styles';
import { GET_UNREAD_NOTIFICATION_STATUS } from './queries';
import { GetUnreadNotificationStatus } from './__generated__/GetUnreadNotificationStatus';

interface TabIconProps {
  name: string;
  tintColor: string;
}

const TabIcon = ({ name, tintColor }: TabIconProps) => {
  const {
    data: { notifications: { nodes = [] } = {}, notificationState } = {},
  } = useQuery<GetUnreadNotificationStatus>(GET_UNREAD_NOTIFICATION_STATUS, {
    skip: name != 'notifications',
    pollInterval: 30000,
  });
  const latestNotification = nodes[0]?.createdAt;
  const iconSize = isAndroid ? 22 : 24;

  const showNotification = () => {
    switch (name) {
      case 'notifications':
        return notificationState?.lastReadDateTime !== latestNotification;
      default:
        return false;
    }
  };

  const icon = () => {
    const props = {
      color: tintColor,
      width: iconSize,
      height: iconSize,
    };
    switch (name) {
      case 'people':
        return <PeopleIcon {...props} />;
      case 'steps':
        return <StepsIcon {...props} />;
      case 'communities':
        return <CommunitiesIcon {...props} />;
      case 'notifications':
        return <NotificationsIcon {...props} />;
    }
  };

  return (
    <Flex value={1} align="center" justify="center">
      {showNotification() ? (
        <Flex style={{ position: 'relative' }}>
          {icon()}
          <Flex style={styles.badge} />
        </Flex>
      ) : (
        icon()
      )}
      <Text style={[styles.text, { color: tintColor }]}>
        {i18next.t(`appRoutes:${name}`)}
      </Text>
    </Flex>
  );
};

export default TabIcon;
