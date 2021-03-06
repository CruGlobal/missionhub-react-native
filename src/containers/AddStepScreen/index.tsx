import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { StatusBar, Keyboard, Alert, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useMutation } from '@apollo/react-hooks';
import { AnyAction } from 'redux';

import { Input } from '../../components/common';
import theme from '../../theme';
import {
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  STEP_NOTE,
  CREATE_STEP,
} from '../../constants';
import DeprecatedBackButton from '../DeprecatedBackButton';
import Skip from '../../components/Skip';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { StepTypeBadge } from '../../components/StepTypeBadge/StepTypeBadge';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { STEPS_QUERY } from '../StepsScreen/queries';
import { PERSON_STEPS_QUERY } from '../PersonScreen/PersonSteps/queries';
import { trackStepAdded } from '../../actions/analytics';
import { updatePersonGQL } from '../../actions/person';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { isAndroid } from '../../utils/common';
import { RootState } from '../../reducers';

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
}

interface AddStepScreenProps {
  next: (
    props: AddStepScreenNextProps,
  ) => ThunkAction<void, RootState, never, AnyAction>;
}

const AddStepScreen = ({ next }: AddStepScreenProps) => {
  const { t } = useTranslation('addStep');
  const dispatch = useDispatch();
  useAndroidBackButton();
  const type: string = useNavigationParam('type');
  const stepType: StepTypeEnum | undefined = useNavigationParam('stepType');
  const personId: string = useNavigationParam('personId');
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

  useAnalytics([screenSection, screenSubsection]);

  const [savedText, setSavedText] = useState((isEdit && initialText) || '');
  const [hasSkipped, changeHasSkipped] = useState(false);

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
    onCompleted: data => dispatch(trackStepAdded(data.createCustomStep?.step)),
  });

  const onChangeText = (newText: string) => {
    setSavedText(newText);

    if (isCreateStep && newText.length >= characterLimit) {
      Alert.alert('', t('makeShorter'));
    }
  };

  const navigateNext = async (text?: string) => {
    onSetComplete && (await onSetComplete());

    dispatch(next({ text, id, type, personId }));
  };

  const handleSaveStep = async () => {
    Keyboard.dismiss();

    const finalText = savedText.trim();

    if (!finalText) {
      return;
    }

    if (isCreateStep) {
      await createCustomStep({
        variables: {
          title: finalText,
          stepType,
          receiverId: personId,
        },
      });
      updatePersonGQL(personId);
    }

    navigateNext(finalText);
  };

  const handleSkip = () => {
    Keyboard.dismiss();
    changeHasSkipped(true);
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
        left={<DeprecatedBackButton iconStyle={styles.backButtonStyle} />}
        right={
          isStepNote ? (
            <Skip
              onSkip={handleSkip}
              disabled={hasSkipped}
              textStyle={styles.skipBtnText}
            />
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
        style={{ marginBottom: isAndroid ? 80 : undefined }}
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
        disabled={hasSkipped}
        testID="saveStepButton"
      />
    </View>
  );
};

export default AddStepScreen;
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
export const COMPLETE_STEP_SCREEN = 'nav/COMPLETE_STEP';
