import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../common';
import theme from '../../theme';
import ItemHeaderText from '../ItemHeaderText';
import { AuthState } from '../../reducers/auth';
import { useIsMount } from '../../utils/hooks/useIsMount';

import styles from './styles';

function getAnimation(isHiding = false, isInitialMount = false): string {
  return isHiding ? (isInitialMount ? '' : 'fadeOutRight') : 'fadeInRight';
}

type StepType = {
  id: string;
  title: string;
  accepted_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  notified_at?: string;
  note?: string;
  owner: object;
  receiver?: { id: string; full_name: string };
};

export interface StepItemProps {
  step: StepType;
  onSelect?: (step: StepType) => void;
  onAction?: (step: StepType) => void;
  onPressName?: (step: StepType) => void;
  hideAction?: boolean;
  type?: 'swipeable' | 'contact' | 'reminder';
  myId?: string;
}
const StepItem = ({
  step,
  onSelect,
  onAction,
  onPressName,
  hideAction,
  type,
  myId,
}: StepItemProps) => {
  const { t } = useTranslation();
  const isMount = useIsMount();
  const [hovering, setHovering] = useState(false);
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    setAnimation(getAnimation(hideAction, isMount));
  }, [hideAction]);

  const onHover = () => setHovering(true);
  const onBlur = () => setHovering(false);

  const handleAction = () => {
    onAction && onAction(step);
  };

  const handleSelect = () => {
    step.receiver && onSelect && onSelect(step);
  };

  const handlePressName = () => {
    step.receiver && onPressName && onPressName(step);
  };

  const renderPersonName = () => {
    if (type === 'contact') {
      return null;
    }

    if (onPressName) {
      return (
        <Touchable
          testID="StepItemPersonButton"
          onPress={handlePressName}
          style={styles.nameWrap}
        >
          <ItemHeaderText text={ownerName} />
        </Touchable>
      );
    }

    return (
      <View style={styles.nameWrap}>
        <ItemHeaderText text={ownerName} />
      </View>
    );
  };

  const renderIcon = () => {
    // Don't show on the initial render if `hideAction` is true or there is no `onAction`
    if (!onAction || !animation) {
      return null;
    }
    let iconName = 'starIcon';
    if (hovering || type === 'reminder') {
      iconName = 'starIconFilled';
    }
    return (
      <Touchable
        testID="StepItemIconButton"
        onPress={handleAction}
        onPressIn={onHover}
        onPressOut={onBlur}
        style={styles.iconWrap}
      >
        <Flex align="center" justify="center" animation={animation}>
          <Icon
            name={iconName}
            type="MissionHub"
            style={[
              styles.icon,
              type === 'reminder' ? styles.iconReminder : undefined,
            ]}
          />
        </Flex>
      </Touchable>
    );
  };

  const isMe = step.receiver && step.receiver.id === myId;
  const ownerName = isMe
    ? t('me')
    : (step.receiver && step.receiver.full_name) || '';
  return (
    <Touchable
      testID="StepItemButton"
      highlight={type !== 'reminder'}
      style={type && styles[type] ? styles[type] : undefined}
      onPress={handleSelect}
      activeOpacity={1}
      underlayColor={theme.convert({
        color: theme.secondaryColor,
        lighten: 0.5,
      })}
    >
      <View style={styles.contentWrap}>
        <View style={styles.textWrap}>
          {renderPersonName()}
          <Text style={styles.description}>{step.title}</Text>
        </View>
        {renderIcon()}
      </View>
    </Touchable>
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  myId: auth.person.id,
});
export default connect(mapStateToProps)(StepItem);
