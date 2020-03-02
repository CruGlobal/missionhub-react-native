/* eslint complexity: 0 */

import React, { useState } from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { StatusBar, Keyboard, Alert, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { TrackStateContext } from '../../actions/analytics';
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
import {
  getAnalyticsSectionType,
  getAnalyticsAssignmentType,
} from '../../utils/common';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';

const characterLimit = 255;

interface AddStepScreenProps {
  next: (props: {
    text?: string;
    id?: string;
    type: string;
    personId: string;
    orgId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>;
  analyticsSection: TrackStateContext[typeof ANALYTICS_SECTION_TYPE];
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
  myId: string;
}

const AddStepScreen = ({
  next,
  analyticsSection,
  analyticsAssignmentType,
  myId,
}: AddStepScreenProps) => {
  const { t } = useTranslation('addStep');
  const dispatch = useDispatch();
  useAndroidBackButton();
  const type: string = useNavigationParam('type');
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');
  const id: string | undefined = useNavigationParam('id');
  const initialText: string | undefined = useNavigationParam('initialText');
  const onSetComplete: (() => void) | undefined = useNavigationParam(
    'onSetComplete',
  );

  const isMe = myId === personId;
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
  useAnalytics({
    screenName: [screenSection, screenSubsection],
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
    },
  });

  const [savedText, setSavedText] = useState((isEdit && initialText) || '');

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

  const handleSaveStep = () => {
    Keyboard.dismiss();

    const finalText = savedText.trim();

    if (!finalText) {
      return;
    }

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
      <ScrollView
        contentContainerStyle={styles.fieldWrap}
        contentInset={{ bottom: 96 }}
      >
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

const mapStateToProps = (
  {
    auth,
    onboarding,
  }: {
    auth: AuthState;
    onboarding: OnboardingState;
  },
  {
    navigation: {
      state: {
        params: { personId },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  myId: auth.person.id,
  analyticsSection: getAnalyticsSectionType(onboarding),
  analyticsAssignmentType: getAnalyticsAssignmentType(personId, auth),
});

export default connect(mapStateToProps)(AddStepScreen);
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
export const COMPLETE_STEP_SCREEN = 'nav/COMPLETE_STEP';
