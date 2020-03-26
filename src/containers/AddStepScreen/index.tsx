/* eslint complexity: 0 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar, Keyboard, Alert, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useMutation } from '@apollo/react-hooks';

import { Input } from '../../components/common';
import theme from '../../theme';
import {
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  STEP_NOTE,
  CREATE_STEP,
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../constants';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { StepTypeBadge } from '../../components/StepTypeBadge/StepTypeBadge';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { STEPS_QUERY } from '../StepsScreen/queries';
import { PERSON_STEPS_QUERY } from '../ContactSteps/queries';
import { trackStepAdded } from '../../actions/analytics';
import {
  getAnalyticsSectionType,
  getAnalyticsAssignmentType,
} from '../../utils/analytics';
import { useIsMe } from '../../utils/hooks/useIsMe';

import styles from './styles';
import { CREATE_CUSTOM_STEP_MUTATION } from './queries';
import {
  CreateCustomStep,
  CreateCustomStepVariables,
} from './__generated__/CreateCustomStep';

const characterLimit = 255;

export interface AddStepScreenNextProps {
  text?: string;
  id?: string;
  type: string;
  personId: string;
  orgId?: string;
}

interface AddStepScreenProps {
  next: (
    props: AddStepScreenNextProps,
  ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, {}, never>;
}

const AddStepScreen = ({ next }: AddStepScreenProps) => {
  const { t } = useTranslation('addStep');
  const dispatch = useDispatch();
  useAndroidBackButton();
  const type: string = useNavigationParam('type');
  const stepType: StepTypeEnum | undefined = useNavigationParam('stepType');
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');
  const id: string | undefined = useNavigationParam('id');
  const initialText: string | undefined = useNavigationParam('initialText');
  const onSetComplete: (() => void) | undefined = useNavigationParam(
    'onSetComplete',
  );

  const isMe = useIsMe(personId);
  const isStepNote = type === STEP_NOTE;
  const isCreateStep = type === CREATE_STEP;
  const isEdit = [EDIT_JOURNEY_STEP, EDIT_JOURNEY_ITEM].includes(type);

  const screenSection = isCreateStep
    ? 'custom step'
    : isStepNote
    ? 'step note'
    : isEdit
    ? isMe
      ? 'my journey'
      : 'our journey'
    : '';
  const screenSubsection = isEdit ? 'edit' : 'add';
  const analyticsSection = useSelector(
    ({ onboarding }: { onboarding: OnboardingState }) =>
      getAnalyticsSectionType(onboarding),
  );
  const analyticsAssignmentType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsAssignmentType({ id: personId }, auth),
  );
  useAnalytics([screenSection, screenSubsection], {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
    },
  });

  const [savedText, setSavedText] = useState((isEdit && initialText) || '');

  const [createCustomStep, { error: errorCreateCustomStep }] = useMutation<
    CreateCustomStep,
    CreateCustomStepVariables
  >(CREATE_CUSTOM_STEP_MUTATION, {
    refetchQueries: [
      { query: STEPS_QUERY },
      {
        query: PERSON_STEPS_QUERY,
        variables: { personId, completed: false },
      },
    ],
    onCompleted: data => dispatch(trackStepAdded(data.createStep?.step)),
  });

  const onChangeText = (newText: string) => {
    setSavedText(newText);

    if (isCreateStep && newText.length >= characterLimit) {
      Alert.alert('', t('makeShorter'));
    }
  };

  const navigateNext = async (text?: string) => {
    onSetComplete && (await onSetComplete());

    dispatch(next({ text, id, type, personId, orgId }));
  };

  const handleSaveStep = async () => {
    Keyboard.dismiss();

    const finalText = savedText.trim();

    if (!finalText) {
      return;
    }

    isCreateStep &&
      (await createCustomStep({
        variables: {
          title: finalText,
          stepType,
          receiverId: personId,
          communityId: orgId,
        },
      }));

    navigateNext(finalText);
  };

  const handleSkip = () => {
    Keyboard.dismiss();

    navigateNext();
  };

  const title = t(
    isStepNote ? 'journeyHeader' : isEdit ? 'editJourneyHeader' : 'header',
  );

  const buttonText = t(
    isStepNote
      ? isMe
        ? 'addJourneyMe'
        : 'addJourneyPerson'
      : isEdit
      ? 'editJourneyButton'
      : 'selectStep:addStep',
  );

  return (
    <View style={styles.container}>
      <Header
        left={<BackButton iconStyle={styles.backButtonStyle} />}
        right={
          isStepNote ? (
            <Skip onSkip={handleSkip} textStyle={styles.skipBtnText} />
          ) : null
        }
      />
      <StatusBar {...theme.statusBar.darkContent} />
      <ErrorNotice
        message={t('errorSavingStep')}
        error={errorCreateCustomStep}
        refetch={handleSaveStep}
      />
      <ScrollView
        contentContainerStyle={styles.fieldWrap}
        contentInset={{ bottom: 96 }}
      >
        {isCreateStep ? (
          <StepTypeBadge stepType={stepType} style={styles.badge} />
        ) : null}
        <Input
          testID="stepInput"
          scrollEnabled={false}
          style={styles.input}
          onChangeText={onChangeText}
          value={savedText}
          multiline={true}
          textAlignVertical="top"
          autoFocus={true}
          autoCorrect={true}
          returnKeyType="done"
          blurOnSubmit={true}
          placeholder={title}
          placeholderTextColor={theme.lightGrey}
          maxLength={type === CREATE_STEP ? characterLimit : undefined}
        />
      </ScrollView>
      <BottomButton
        onPress={handleSaveStep}
        text={buttonText}
        testID="saveStepButton"
      />
    </View>
  );
};

export default AddStepScreen;
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
export const COMPLETE_STEP_SCREEN = 'nav/COMPLETE_STEP';
