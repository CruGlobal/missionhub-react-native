import React, { useState, useEffect } from 'react';
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
  hideAction?: boolean;
  type?: 'swipeable' | 'contact' | 'reminder';
  myId?: string;
}
const StepItem = ({
  step,
  onSelect,
  onAction,
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
    if (!step.receiver) {
      return;
    } else {
      onSelect && onSelect(step);
    }
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
  let ownerName = isMe ? t('me') : step.receiver ? step.receiver.full_name : '';
  ownerName = (ownerName || '').toUpperCase();
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
      <Flex align="center" direction="row" style={styles.row}>
        <Flex value={1} justify="center" direction="column">
          {type === 'contact' ? null : <ItemHeaderText text={ownerName} />}
          <Text style={styles.description}>{step.title}</Text>
        </Flex>
        {renderIcon()}
      </Flex>
    </Touchable>
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  myId: auth.person.id,
});
export default connect(mapStateToProps)(StepItem);
