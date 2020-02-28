import React from 'react';
import { AnyAction } from 'redux';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';

import { Button, Icon } from '../../components/common';
import { completeStep, deleteStepWithTracking } from '../../actions/steps';
import { removeStepReminder } from '../../actions/stepReminders';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';
import ReminderDateText from '../../components/ReminderDateText';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';
import { ACCEPTED_STEP_DETAIL_QUERY } from './queries';
import {
  AcceptedStepDetail,
  AcceptedStepDetailVariables,
} from './__generated__/AcceptedStepDetail';

interface AcceptedStepDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const AcceptedStepDetailScreen = ({
  dispatch,
}: AcceptedStepDetailScreenProps) => {
  const { t } = useTranslation('acceptedStepDetail');
  useAnalytics({ screenName: ['step detail', 'active step'] });
  const { data: { step } = { step: undefined }, error, refetch } = useQuery<
    AcceptedStepDetail,
    AcceptedStepDetailVariables
  >(ACCEPTED_STEP_DETAIL_QUERY, {
    variables: { id: useNavigationParam('stepId') },
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
        (step?.stepSuggestion && step?.stepSuggestion.descriptionMarkdown) ||
        undefined
      }
      text={step?.title ?? ''}
      bottomButtonProps={{
        onPress: handleCompleteStep,
        text: t('iDidIt'),
      }}
    />
  );
};

export default connect()(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
