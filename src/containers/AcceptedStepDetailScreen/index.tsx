import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Button, Icon } from '../../components/common';
import { completeStep, removeFromStepsList } from '../../actions/steps';
import { removeStepReminder } from '../../actions/stepReminders';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';
import ReminderDateText from '../../components/ReminderDateText';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { trackStepDeleted } from '../../actions/analytics';

import styles from './styles';
import { ACCEPTED_STEP_DETAIL_QUERY, DELETE_STEP_MUTATION } from './queries';
import {
  AcceptedStepDetail,
  AcceptedStepDetailVariables,
} from './__generated__/AcceptedStepDetail';
import { DeleteStep, DeleteStepVariables } from './__generated__/DeleteStep';

const AcceptedStepDetailScreen = () => {
  const { t } = useTranslation('acceptedStepDetail');
  const dispatch = useDispatch();
  const personId: string = useNavigationParam('personId');

  useAnalytics(['step detail', 'active step'], {
    assignmentType: { personId },
  });

  const { data: { step } = { step: undefined }, error, refetch } = useQuery<
    AcceptedStepDetail,
    AcceptedStepDetailVariables
  >(ACCEPTED_STEP_DETAIL_QUERY, {
    variables: { id: useNavigationParam('stepId') },
  });

  const [deleteStep] = useMutation<DeleteStep, DeleteStepVariables>(
    DELETE_STEP_MUTATION,
    {
      onCompleted: data => {
        dispatch(trackStepDeleted('Step Detail'));
        data.deleteStep?.id &&
          removeFromStepsList(data.deleteStep.id, personId);
      },
    },
  );

  const post = step?.post;
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
    step && deleteStep({ variables: { input: { id: step.id } } });
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
      firstName={step?.receiver.firstName}
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
      post={post ?? undefined}
      text={step?.title}
      stepType={step?.stepType}
      bottomButtonProps={{
        onPress: handleCompleteStep,
        text: t('iDidIt'),
      }}
    />
  );
};

export default AcceptedStepDetailScreen;
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
