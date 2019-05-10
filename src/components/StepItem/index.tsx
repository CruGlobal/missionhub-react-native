import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { gql } from 'apollo-boost';

import { Flex, Text, Touchable, Icon } from '../common';
import theme from '../../theme';
import ItemHeaderText from '../ItemHeaderText';
import { StepsList_acceptedChallenges_nodes } from '../../containers/StepsScreen/__generated__/StepsList';
import { AuthState } from '../../reducers/auth';

import styles from './styles';

type Step = StepsList_acceptedChallenges_nodes;

type StepItemDisplayType = 'swipeable' | 'contact' | 'reminder';

export const STEP_ITEM_QUERY = gql`
  fragment StepItem on AcceptedChallenge {
    title
    receiver {
      id
      fullName
    }
  }
`;

const StepItem = ({
  step,
  type,
  onSelect = () => {},
  onAction = () => {},
  hideAction = false,
  myId,
}: {
  step: Step;
  type: StepItemDisplayType;
  onSelect: (step: Step) => void;
  onAction: (step: Step) => void;
  hideAction: boolean;
  myId: string;
}) => {
  const { t } = useTranslation();
  const [{ hovering }, setState] = useState({ hovering: false });

  const onHover = () => setState({ hovering: true });
  const onBlur = () => setState({ hovering: false });
  const handleAction = () => {
    onAction(step);
  };
  const handleSelect = () => {
    if (!step.receiver) {
      return;
    } else {
      onSelect(step);
    }
  };

  const renderIcon = () => {
    if (!onAction) {
      return null;
    }

    let iconName = 'starIcon';
    if (hovering || type === 'reminder') {
      iconName = 'starIconFilled';
    }
    return (
      <Touchable onPress={handleAction} onPressIn={onHover} onPressOut={onBlur}>
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
