import React from 'react';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Text, Icon, Card, Touchable, Button } from '../common';
import ItemHeaderText from '../ItemHeaderText';
import ReminderButton from '../ReminderButton';
import ReminderDateText from '../ReminderDateText';
import { useIsMe } from '../../utils/hooks/useIsMe';
import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import BLUE_CHECKBOX from '../../../assets/images/checkIcon-blue.png';
import { navigatePush } from '../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../containers/AcceptedStepDetailScreen';
import { COMPLETED_STEP_DETAIL_SCREEN } from '../../containers/CompletedStepDetailScreen';
import { navToPersonScreen } from '../../actions/person';
import { completeStep } from '../../actions/steps';
import { CONTACT_STEPS } from '../../constants';
import { StepTypeBadge } from '../StepTypeBadge/StepTypeBadge';

import { StepItem as Step } from './__generated__/StepItem';
import styles from './styles';

export interface StepItemProps {
  step: Step;
  showName?: boolean;
  showCheckbox?: boolean;
  testID?: string;
}
const StepItem = ({
  step,
  showName = true,
  showCheckbox = true,
}: StepItemProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onPressCard = () => {
    dispatch(
      navigatePush(
        step.completedAt
          ? COMPLETED_STEP_DETAIL_SCREEN
          : ACCEPTED_STEP_DETAIL_SCREEN,
        { stepId: step.id },
      ),
    );
  };

  const onPressName = () => {
    const { receiver, community } = step;
    dispatch(navToPersonScreen(receiver, community));
  };

  const onPressCheckbox = async () => {
    await dispatch(completeStep(step, CONTACT_STEPS));
  };

  const isMe = useIsMe(step.receiver && step.receiver.id);
  const ownerName = isMe
    ? t('me')
    : (step.receiver && step.receiver.fullName) || '';
  const {
    cardHeader,
    bellIcon,
    reminderButton,
    iconButton,
    checkIcon,
  } = styles;
  return (
    <Card testID="StepItemCard" onPress={onPressCard} style={styles.card}>
      <View>
        <View style={cardHeader}>
          {showName ? (
            <Touchable
              testID="StepItemPersonButton"
              onPress={onPressName}
              style={styles.nameWrap}
            >
              <ItemHeaderText style={styles.stepUserName} text={ownerName} />
            </Touchable>
          ) : (
            <StepTypeBadge stepType={step.stepType} />
          )}
        </View>
        <Text style={styles.description}>{step.title}</Text>
        {step.completedAt ? null : (
          <ReminderButton
            testID="StepReminderButton"
            stepId={step.id}
            reminder={step.reminder}
          >
            <View style={reminderButton}>
              {step.reminder ? (
                <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
              ) : null}
              <ReminderDateText reminder={step.reminder} />
            </View>
          </ReminderButton>
        )}
      </View>
      {showCheckbox ? (
        <Button
          testID="CompleteStepButton"
          onPress={onPressCheckbox}
          style={iconButton}
          disabled={!!step.completedAt}
        >
          <Image
            source={step.completedAt ? GREY_CHECKBOX : BLUE_CHECKBOX}
            style={checkIcon}
          />
        </Button>
      ) : null}
    </Card>
  );
};

export default StepItem;
