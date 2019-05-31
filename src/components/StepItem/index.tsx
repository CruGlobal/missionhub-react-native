import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { gql } from 'apollo-boost';

import { Flex, Text, Touchable, Icon } from '../common';
import theme from '../../theme';
import ItemHeaderText from '../ItemHeaderText';
import { AuthState } from '../../reducers/auth';
import { useIsMount } from '../../utils/hooks/useIsMount';

import styles from './styles';
import { StepItem as Step } from './__generated__/StepItem';

export const STEP_ITEM_QUERY = gql`
  fragment StepItem on AcceptedChallenge {
    title
    receiver {
      id
      fullName
    }
  }
`;

type StepItemDisplayType = 'swipeable' | 'contact' | 'reminder';

type StepItemProps = StepItemStateProps & StepItemOwnProps;
interface StepItemStateProps {
  myId: string;
}

interface StepItemOwnProps {
  step: Step;
  type: StepItemDisplayType;
  onSelect?: () => void;
  onAction?: () => void;
  hideAction?: boolean;
  testID?: string;
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  type,
  onSelect = () => {},
  onAction,
  hideAction = false,
  myId,
}) => {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);
  const isMount = useIsMount();

  const onHover = () => setHovering(true);
  const onBlur = () => setHovering(false);
  const handleAction = () => {
    onAction && onAction();
  };
  const handleSelect = () => {
    if (!step.receiver) {
      return;
    } else {
      onSelect();
    }
  };

  const renderIcon = () => {
    // Don't show on the initial render if `hideAction` is true or there is no `onAction`
    if ((isMount && hideAction) || !onAction) {
      return null;
    }

    let iconName = 'starIcon';
    if (hovering || type === 'reminder') {
      iconName = 'starIconFilled';
    }
    return (
      <Touchable
        testID="star-icon-button"
        onPress={handleAction}
        onPressIn={onHover}
        onPressOut={onBlur}
      >
        <Flex
          align="center"
          justify="center"
          animation={hideAction ? 'fadeOutRight' : 'fadeInRight'}
        >
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
  let ownerName = isMe ? t('me') : step.receiver ? step.receiver.fullName : '';
  ownerName = (ownerName || '').toUpperCase();
  return (
    <Touchable
      testID="step-item-row"
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
