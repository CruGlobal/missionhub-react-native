import React from 'react';
import i18next from 'i18next';
import { useQuery } from '@apollo/react-hooks';

import Flex from '../../components/Flex';
import Icon from '../../components/Icon';
import { Text } from '../../components/common';
import { isAndroid } from '../../utils/common';

import styles from './styles';
import { GET_UNREAD_COMMENTS_COUNT } from './queries';
import { getUnreadCommentsCount } from './__generated__/getUnreadCommentsCount';

interface TabIconProps {
  name: string;
  tintColor: string;
}

const TabIcon = ({ name, tintColor }: TabIconProps) => {
  const { data: { communities: { nodes = [] } = {} } = {} } = useQuery<
    getUnreadCommentsCount
  >(GET_UNREAD_COMMENTS_COUNT, {
    skip: name != 'group',
    pollInterval: 30000,
  });

  const showNotification = nodes.some(n => n.unreadCommentsCount > 0);

  const icon = (
    <Icon
      type="MissionHub"
      name={`${name}Icon`}
      size={isAndroid ? 22 : 24}
      style={{ color: tintColor }}
    />
  );

  return (
    <Flex value={1} align="center" justify="center">
      {showNotification ? (
        <Flex style={{ position: 'relative' }}>
          {icon}
          <Flex style={styles.badge} />
        </Flex>
      ) : (
        icon
      )}
      <Text style={[styles.text, { color: tintColor }]}>
        {i18next.t(`appRoutes:${name}`)}
      </Text>
    </Flex>
  );
};

export default TabIcon;
