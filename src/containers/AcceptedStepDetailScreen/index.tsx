import React from 'react';
import { View } from 'react-native';
import { connect, useDispatch } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import { Button, Icon } from '../../components/common';
import { getAnalyticsAssignmentType } from '../../utils/common';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { completeStep, deleteStepWithTracking } from '../../actions/steps';
import { TrackStateContext } from '../../actions/analytics';
import { removeStepReminder } from '../../actions/stepReminders';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';
import ReminderDateText from '../../components/ReminderDateText';
import { reminderSelector } from '../../selectors/stepReminders';
import { ReminderType, StepReminderState } from '../../reducers/stepReminders';
import { Step } from '../../reducers/steps';
import { AuthState } from '../../reducers/auth';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';

interface AcceptedStepDetailScreenProps {
  reminder?: ReminderType;
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const AcceptedStepDetailScreen = ({
  reminder,
  analyticsAssignmentType,
}: AcceptedStepDetailScreenProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('acceptedStepDetail');
  useAnalytics({
    screenName: ['step detail', 'active step'],
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });
  const step: Step = useNavigationParam('step');

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
            testID="removeReminderButton"
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
          testID="removeStepButton"
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
  {
    auth,
    stepReminders,
  }: { auth: AuthState; stepReminders: StepReminderState },
  {
    navigation: {
      state: {
        params: { step },
      },
    } = { state: { params: { step: {} as Step } } },
  }: { navigation?: { state: { params: { step: Step } } } },
) => ({
  reminder: reminderSelector({ stepReminders }, { stepId: step.id }),
  analyticsAssignmentType: getAnalyticsAssignmentType(step.receiver.id, auth),
});

export default connect(mapStateToProps)(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
