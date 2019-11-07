import React from 'react';
import { AnyAction } from 'redux';
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
import { ReminderType, StepReminderState } from '../../reducers/stepReminders';
import { Step } from '../../reducers/steps';

import styles from './styles';

interface AcceptedStepDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  step: Step;
  reminder?: ReminderType;
}

const AcceptedStepDetailScreen = ({
  dispatch,
  step,
  reminder,
}: AcceptedStepDetailScreenProps) => {
  const { t } = useTranslation('acceptedStepDetail');

  const { id: stepId, challenge_suggestion, title, receiver } = step;

  const handleCompleteStep = () =>
    dispatch(completeStep(step, 'Step Detail', true));

  const handleRemoveStep = () => {
    dispatch(deleteStepWithTracking(step, 'Step Detail'));
    dispatch(navigateBack());
  };

  const handleRemoveReminder = () => dispatch(removeStepReminder(stepId));

  const renderReminderButton = () => (
    <ReminderButton stepId={stepId} reminder={reminder}>
      <View style={styles.reminderButton}>
        <View style={styles.reminderContainer}>
          <View style={styles.reminderIconCircle}>
            <Icon
              name="bellIcon"
              type="MissionHub"
              style={styles.reminderIcon}
            />
          </View>
          <ReminderDateText style={styles.reminderText} reminder={reminder} />
        </View>
        {reminder ? (
          <Button
            onPress={handleRemoveReminder}
            style={styles.cancelIconButton}
          >
            <Icon name="close" type="Material" style={styles.cancelIcon} />
          </Button>
        ) : null}
      </View>
    </ReminderButton>
  );

  return (
    <StepDetailScreen
      receiver={receiver}
      CenterHeader={null}
      RightHeader={
        <Button
          type="transparent"
          text={t('removeStep').toUpperCase()}
          onPress={handleRemoveStep}
          style={styles.removeStepButton}
          buttonTextStyle={styles.removeStepButtonText}
        />
      }
      CenterContent={renderReminderButton()}
      markdown={
        challenge_suggestion && challenge_suggestion.description_markdown
      }
      text={title}
      bottomButtonProps={{
        onPress: handleCompleteStep,
        text: t('iDidIt'),
      }}
    />
  );
};

const mapStateToProps = (
  { stepReminders }: { stepReminders: StepReminderState },
  {
    navigation: {
      state: {
        params: { step },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  step,
  reminder: reminderSelector({ stepReminders }, { stepId: step.id }),
});

export default connect(mapStateToProps)(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
