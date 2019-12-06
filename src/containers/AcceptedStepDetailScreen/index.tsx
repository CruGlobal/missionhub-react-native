import React from 'react';
import { AnyAction } from 'redux';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Button, Icon } from '../../components/common';
import { completeStep, deleteStepWithTracking } from '../../actions/steps';
import { removeStepReminder } from '../../actions/stepReminders';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';
import { REMINDER_BUTTON_FRAGMENT } from '../../components/ReminderButton/queries';
import ReminderDateText from '../../components/ReminderDateText';
import { REMINDER_DATE_TEXT_FRAGMENT } from '../../components/ReminderDateText/queries';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';

import styles from './styles';
import {
  AcceptedStepDetail,
  AcceptedStepDetailVariables,
} from './__generated__/AcceptedStepDetail';

const ACCEPTED_STEP_DETAIL_QUERY = gql`
  query AcceptedStepDetail($id: ID!) {
    step(id: $id) {
      id
      title
      stepSuggestion {
        descriptionMarkdown
      }
      receiver {
        id
        firstName
      }
      community {
        id
      }
      reminder {
        ...ReminderButton
        ...ReminderDateText
      }
    }
  }
  ${REMINDER_BUTTON_FRAGMENT}
  ${REMINDER_DATE_TEXT_FRAGMENT}
`;

interface AcceptedStepDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const AcceptedStepDetailScreen = ({
  dispatch,
}: AcceptedStepDetailScreenProps) => {
  const { t } = useTranslation('acceptedStepDetail');
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
          message={t('stepDetailError')}
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
