import React from 'react';
import { View, Image, GestureResponderEvent } from 'react-native';
import i18n from 'i18next';

import { Text, Card, Icon, IconButton } from '../../components/common';
import theme from '../../theme';
import COMMENTS from '../../../assets/images/comments.png';

import styles from './styles';

interface UnreadCommentsCardProps {
  testID?: string;
  count: number;
  onPress: Function & ((event: GestureResponderEvent) => void);
  onClose: Function;
}

export default function UnreadCommentsCard({
  count,
  onPress,
  onClose,
}: UnreadCommentsCardProps) {
  return (
    <Card onPress={onPress} style={styles.card} testID="CardButton">
      <View style={styles.flex1}>
        <View style={styles.content}>
          <Text style={styles.number}>{count}</Text>
          <Text style={styles.description}>
            {i18n.t('celebrateFeedHeader:newComments', { count })}
          </Text>
          <Image source={COMMENTS} style={styles.background} />
        </View>
        <View style={styles.viewWrap}>
          <Text style={styles.viewText}>{i18n.t('view').toUpperCase()}</Text>
          <Icon name="rightArrowIcon" type="MissionHub" size={12} />
        </View>
        <View style={styles.closeWrap}>
          <IconButton
            testID="CloseButton"
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
