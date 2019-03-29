import React from 'react';
import { View, Image } from 'react-native';
import i18n from 'i18next';

import { Text, Card, Icon, IconButton } from '../../components/common';
import theme from '../../theme';
import COMMENTS from '../../../assets/images/comments.png';

import styles from './styles';

export default function UnreadCommentsCard({ count, onPress, onClose }) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View flex={1}>
        <View style={styles.content}>
          <Text style={styles.number}>{count}</Text>
          <Text style={styles.description}>
            {i18n.t('celebrateFeedHeader:newComments')}
          </Text>
          <Image source={COMMENTS} style={styles.background} />
        </View>
        <View style={styles.viewWrap}>
          <Text style={styles.viewText}>{i18n.t('view').toUpperCase()}</Text>
          <Icon
            name="rightArrowIcon"
            type="MissionHub"
            size={12}
            style={styles.anyIcon}
          />
        </View>
        <View style={styles.closeWrap}>
          <IconButton
            name="deleteIcon"
            type="MissionHub"
            onPress={onClose}
            hitSlop={theme.hitSlop(10)}
            size={13}
          />
        </View>
      </View>
    </Card>
  );
}
