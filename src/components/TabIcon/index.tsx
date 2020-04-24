import React from 'react';
import i18next from 'i18next';
import { useQuery } from '@apollo/react-hooks';

import Flex from '../Flex';
import { Text } from '../common';
import PeopleIcon from '../../../assets/images/mainNav/peopleIcon.svg';
import StepsIcon from '../../../assets/images/mainNav/stepsIcon.svg';
import CommunitiesIcon from '../../../assets/images/mainNav/communitiesIcon.svg';
import NotificationsIcon from '../../../assets/images/mainNav/notificationsIcon.svg';

import styles from './styles';
import { GET_UNREAD_COMMENTS_COUNT } from './queries';
import { getUnreadCommentsCount } from './__generated__/getUnreadCommentsCount';

interface TabIconProps {
  name: string;
  tintColor: string;
}

const TabIcon = ({ name, tintColor }: TabIconProps) => {
  const { data: { unreadCommentsCount = 0 } = {} } = useQuery<
    getUnreadCommentsCount
  >(GET_UNREAD_COMMENTS_COUNT, {
    skip: name != 'notifications' && name != 'communities',
    pollInterval: 30000,
  });

  const showNotification = unreadCommentsCount > 0;

  const icon = () => {
    switch (name) {
      case 'people':
        return <PeopleIcon color={tintColor} />;
      case 'steps':
        return <StepsIcon color={tintColor} />;
      case 'communities':
        return <CommunitiesIcon color={tintColor} />;
      case 'notifications':
        return <NotificationsIcon color={tintColor} />;
    }
  };

  return (
    <Flex value={1} align="center" justify="center">
      {showNotification ? (
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
