import React, { useEffect } from 'react';
import i18next from 'i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Flex from '../Flex';
import { Text } from '../common';
import { isAndroid } from '../../utils/common';
import PeopleIcon from '../../../assets/images/mainNav/peopleIcon.svg';
import StepsIcon from '../../../assets/images/mainNav/stepsIcon.svg';
import CommunitiesIcon from '../../../assets/images/mainNav/communitiesIcon.svg';
import NotificationsIcon from '../../../assets/images/mainNav/notificationsIcon.svg';

import styles from './styles';
import {
  GET_UNREAD_COMMENTS_AND_NOTIFICATION,
  UPDATE_LATEST_NOTIFICATION,
} from './queries';
import { getUnreadCommentAndNotification } from './__generated__/getUnreadCommentAndNotification';

interface TabIconProps {
  name: string;
  tintColor: string;
}

const TabIcon = ({ name, tintColor }: TabIconProps) => {
  const {
    data: { notifications: { nodes = [] } = {}, notificationState } = {},
  } = useQuery<getUnreadCommentAndNotification>(
    GET_UNREAD_COMMENTS_AND_NOTIFICATION,
    {
      skip: name != 'notifications',
      pollInterval: 30000,
    },
  );
  const latestNotification = nodes[0]?.createdAt;
  const iconSize = isAndroid ? 22 : 24;

  const [setLastNotification] = useMutation(UPDATE_LATEST_NOTIFICATION, {
    variables: {
      latestNotification,
    },
  });

  useEffect(() => {
    if (
      latestNotification &&
      notificationState?.latestNotification !== latestNotification
    ) {
      setLastNotification();
    }
  }, [latestNotification, notificationState?.latestNotification]);

  const showNotification = () => {
    switch (name) {
      case 'notifications':
        return notificationState?.hasUnreadNotifications;
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
