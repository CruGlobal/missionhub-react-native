import React from 'react';
import { View, Image, Text } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import BLUE_CHECKBOX from '../../../assets/images/checkIcon-blue.png';
import { Card, Button } from '../common';
import ReminderButton from '../ReminderButton';
import ReminderDateText from '../ReminderDateText';
import { completeStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../containers/AcceptedStepDetailScreen';
import { reminderSelector } from '../../selectors/stepReminders';
import { CONTACT_STEPS } from '../../constants';
import { COMPLETED_STEP_DETAIL_SCREEN } from '../../containers/CompletedStepDetailScreen';
import Icon from '../Icon';
import { StepReminderState, ReminderType } from '../../reducers/stepReminders';
import { RootState } from '../../reducers';

import styles from './styles';

type AcceptedStepItemProps = {
  step: {
    id: string;
    title: string;
    body?: string;
    completed_at?: string;
    receiver: {
      id: string;
    };
  };
  reminder?: ReminderType;
  onComplete?: () => void;
  dispatch: ThunkDispatch<RootState, never, AnyAction>;
};

const AcceptedStepItem = ({
  step,
  reminder,
  onComplete,
  dispatch,
}: AcceptedStepItemProps) => {
  const handleNavigateAcceptedDetailScreen = () => {
    dispatch(
      navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, {
        stepId: step.id,
        personId: step.receiver.id,
      }),
    );
  };
  const handleNavigateCompletedDetailScreen = () => {
    dispatch(
      navigatePush(COMPLETED_STEP_DETAIL_SCREEN, {
        stepId: step.id,
        personId: step.receiver.id,
      }),
    );
  };
  const handleCompleteStep = async () => {
    await dispatch(completeStep(step, CONTACT_STEPS));
    onComplete && onComplete();
  };

  const { title, completed_at, id } = step;
  const {
    card,
    stepText,
    stepTextCompleted,
    iconButton,
    checkIcon,
    reminderButton,
    bellIcon,
    flex1,
  } = styles;
  return completed_at ? (
    <Card
      testID="CompletedCardButton"
      onPress={handleNavigateCompletedDetailScreen}
      style={card}
    >
      <View style={flex1}>
        <Text style={[stepText, stepTextCompleted]}>{title}</Text>
      </View>
      <Image source={GREY_CHECKBOX} style={checkIcon} />
    </Card>
  ) : (
    <Card
      testID="AcceptedCardButton"
      onPress={handleNavigateAcceptedDetailScreen}
      style={card}
    >
      <View style={flex1}>
        <ReminderButton stepId={id} reminder={reminder}>
          <View style={reminderButton}>
            <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
            <ReminderDateText reminder={reminder} />
          </View>
        </ReminderButton>
        <Text style={stepText}>{title}</Text>
      </View>
      <Button
        testID="CompleteStepButton"
        onPress={handleCompleteStep}
        style={iconButton}
      >
        <Image source={BLUE_CHECKBOX} style={checkIcon} />
      </Button>
    </Card>
  );
};

const mapStateToProps = (
  { stepReminders }: { stepReminders: StepReminderState },
  { step }: { step: { id: string } },
) => ({
  reminder: reminderSelector({ stepReminders }, { stepId: step.id }),
});

export default connect(mapStateToProps)(AcceptedStepItem);
