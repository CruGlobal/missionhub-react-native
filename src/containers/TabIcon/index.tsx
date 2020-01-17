import React from 'react';
import { connect } from 'react-redux-legacy';
import i18next from 'i18next';

import Flex from '../../components/Flex';
import Icon from '../../components/Icon';
import { Text } from '../../components/common';
import { isAndroid } from '../../utils/common';

import styles from './styles';

// @ts-ignore
function TabIcon({ name, tintColor, showNotification }) {
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
}

// @ts-ignore
const mapStateToProps = ({ auth }, { name }) => ({
  showNotification: name === 'group' && auth.person.unread_comments_count,
});
export default connect(mapStateToProps)(TabIcon);
