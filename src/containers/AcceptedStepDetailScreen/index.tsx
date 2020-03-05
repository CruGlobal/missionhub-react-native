import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';

import { Button, Icon } from '../../components/common';
import { getAnalyticsAssignmentType } from '../../utils/analytics';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { TrackStateContext } from '../../actions/analytics';
import { completeStep, deleteStepWithTracking } from '../../actions/steps';
import { removeStepReminder } from '../../actions/stepReminders';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';
import ReminderDateText from '../../components/ReminderDateText';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { AuthState } from '../../reducers/auth';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';
import { ACCEPTED_STEP_DETAIL_QUERY } from './queries';
import {
  AcceptedStepDetail,
  AcceptedStepDetailVariables,
} from './__generated__/AcceptedStepDetail';

interface AcceptedStepDetailScreenProps {
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const AcceptedStepDetailScreen = ({
  analyticsAssignmentType,
}: AcceptedStepDetailScreenProps) => {
  const { t } = useTranslation('acceptedStepDetail');
  const dispatch = useDispatch();

  const { data: { step } = { step: undefined }, error, refetch } = useQuery<
    AcceptedStepDetail,
    AcceptedStepDetailVariables
  >(ACCEPTED_STEP_DETAIL_QUERY, {
    variables: { id: useNavigationParam('stepId') },
  });

  useAnalytics(['step detail', 'active step'], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
    },
  });

  const handleCompleteStep = () =>
    step &&
    dispatch(
      completeStep(
        {
          id: step.id,
          receiver: step.receiver,
          organization: step.community || undefined,
        },
        'Step Detail',
        true,
      ),
    );

  const handleRemoveStep = () => {
    step && dispatch(deleteStepWithTracking(step, 'Step Detail'));
    dispatch(navigateBack());
  };

  const handleRemoveReminder = () =>
    step && dispatch(removeStepReminder(step.id));

  const renderReminderButton = () =>
    !step ? null : (
      <ReminderButton stepId={step.id} reminder={step.reminder}>
        <View style={styles.reminderButton}>
          <View style={styles.reminderContainer}>
            <View style={styles.reminderIconCircle}>
              <Icon
                name="bellIcon"
                type="MissionHub"
                style={styles.reminderIcon}
              />
            </View>
            <ReminderDateText
              style={styles.reminderText}
              reminder={step.reminder}
            />
          </View>
          {step.reminder ? (
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
      receiver={step?.receiver}
      Banner={
        <ErrorNotice
          message={t('errorLoadingStepDetails')}
          error={error}
          refetch={refetch}
        />
      }
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
        (step?.stepSuggestion && step?.stepSuggestion.descriptionMarkdown) ??
        undefined
      }
      text={step?.title}
      bottomButtonProps={{
        onPress: handleCompleteStep,
        text: t('iDidIt'),
      }}
    />
  );
};

const mapStateToProps = (
  { auth }: { auth: AuthState },
  {
    navigation: {
      state: {
        params: { personId },
      },
    }, //eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any,
) => ({
  analyticsAssignmentType: getAnalyticsAssignmentType({ id: personId }, auth),
});

export default connect(mapStateToProps)(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
