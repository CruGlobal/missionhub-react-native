import React from 'react';
import { View, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { Icon, Card, Touchable, Button } from '../common';
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
import { handleAfterCompleteStep } from '../../actions/steps';
import { COMPLETE_STEP_MUTATION } from '../../containers/AcceptedStepDetailScreen/queries';
import { CONTACT_STEPS } from '../../constants';
import { StepTypeBadge } from '../StepTypeBadge/StepTypeBadge';
import {
  CompleteStep,
  CompleteStepVariables,
} from '../../containers/AcceptedStepDetailScreen/__generated__/CompleteStep';

import { StepItem as Step } from './__generated__/StepItem';
import styles from './styles';

interface StepItemProps {
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

  const [completeStep] = useMutation<CompleteStep, CompleteStepVariables>(
    COMPLETE_STEP_MUTATION,
    {
      onCompleted: data => {
        data.markStepAsCompleted?.step &&
          dispatch(
            handleAfterCompleteStep(
              {
                id: data.markStepAsCompleted?.step?.id,
                receiver: data.markStepAsCompleted?.step?.receiver,
                community: data.markStepAsCompleted?.step?.community,
              },
              CONTACT_STEPS,
            ),
          );
      },
    },
  );

  const onPressCard = () => {
    dispatch(
      navigatePush(
        step.completedAt
          ? COMPLETED_STEP_DETAIL_SCREEN
          : ACCEPTED_STEP_DETAIL_SCREEN,
        { stepId: step.id, personId: step.receiver.id },
      ),
    );
  };

  const onPressName = () => {
    const { receiver } = step;
    dispatch(navToPersonScreen(receiver.id));
  };

  const onPressCheckbox = async () => {
    step && (await completeStep({ variables: { input: { id: step.id } } }));
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
      <View style={{ flex: 1 }}>
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
          <View style={{ alignSelf: 'flex-start' }}>
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
          </View>
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
