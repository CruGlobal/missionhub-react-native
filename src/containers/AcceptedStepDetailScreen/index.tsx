import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';

import { Button, Icon } from '../../components/common';
import { completeStep, deleteStepWithTracking } from '../../actions/steps';
import { removeStepReminder } from '../../actions/stepReminders';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';
import ReminderDateText from '../../components/ReminderDateText';
import { reminderSelector } from '../../selectors/stepReminders';

import styles from './styles';

interface AcceptedStepDetailScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  step?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reminder?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: any;
}

const AcceptedStepDetailScreen = ({
  dispatch,
  step,
  reminder,
}: AcceptedStepDetailScreenProps) => {
  const { t } = useTranslation('acceptedStepDetail');
  const { challenge_suggestion, title, receiver } = step;
  const { removeStepButton, removeStepButtonText } = styles;

  const completeSteps = () => {
    dispatch(completeStep(step, 'Step Detail', true));
  };

  const removeStep = () => {
    dispatch(deleteStepWithTracking(step, 'Step Detail'));
    dispatch(navigateBack());
  };

  const handleRemoveReminder = () => {
    const { id } = step;
    dispatch(removeStepReminder(id));
  };

  const renderReminderButton = () => {
    const { id } = step;
    const {
      reminderButton,
      reminderContainer,
      reminderIconCircle,
      reminderIcon,
      reminderText,
      cancelIconButton,
      cancelIcon,
    } = styles;

    return (
      <ReminderButton stepId={id} reminder={reminder}>
        <View style={reminderButton}>
          <View style={reminderContainer}>
            <View style={reminderIconCircle}>
              <Icon name="bellIcon" type="MissionHub" style={reminderIcon} />
            </View>
            <ReminderDateText style={reminderText} reminder={reminder} />
          </View>
          {reminder ? (
            <Button onPress={handleRemoveReminder} style={cancelIconButton}>
              <Icon name="close" type="Material" style={cancelIcon} />
            </Button>
          ) : null}
        </View>
      </ReminderButton>
    );
  };

  return (
    <StepDetailScreen
      receiver={receiver}
      CenterHeader={null}
      RightHeader={
        <Button
          type="transparent"
          text={t('removeStep').toUpperCase()}
          onPress={removeStep}
          style={removeStepButton}
          buttonTextStyle={removeStepButtonText}
        />
      }
      CenterContent={renderReminderButton()}
      markdown={
        challenge_suggestion && challenge_suggestion.description_markdown
      }
      text={title}
      bottomButtonProps={{
        onPress: completeSteps,
        text: t('iDidIt'),
      }}
    />
  );
};

interface PropsInterface {
  navigation: {
    state: {
      params: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        step: any;
      };
    };
  };
}

const mapStateToProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { stepReminders }: any,
  {
    navigation: {
      state: {
        params: { step },
      },
    },
  }: PropsInterface,
) => ({
  step,
  reminder: reminderSelector({ stepReminders }, { stepId: step.id }),
});
export default connect(mapStateToProps)(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
