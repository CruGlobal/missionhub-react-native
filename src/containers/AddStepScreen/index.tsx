import React, { useState } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StatusBar, Keyboard, Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { Input } from '../../components/common';
import theme from '../../theme';
import {
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  STEP_NOTE,
  CREATE_STEP,
} from '../../constants';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { AuthState } from '../../reducers/auth';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';

import styles from './styles';

const characterLimit = 255;

interface AddStepScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  next: (props: {
    text: string | undefined;
    id: string | undefined;
    type: string;
    personId: string;
    orgId: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>;
  isMe: boolean;
}

const AddStepScreen = ({ dispatch, next, isMe }: AddStepScreenProps) => {
  const { t } = useTranslation('addStep');
  useAndroidBackButton();
  const type: string = useNavigationParam('type');
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');
  const id: string | undefined = useNavigationParam('id');
  const initialText: string | undefined = useNavigationParam('initialText');
  const onSetComplete: () => void | undefined = useNavigationParam(
    'onSetComplete',
  );

  const isStepNote = type === STEP_NOTE;
  const isCreateStep = type === CREATE_STEP;
  const isEdit = [EDIT_JOURNEY_STEP, EDIT_JOURNEY_ITEM].includes(type);

  const [savedText, setSavedText] = useState(
    (isEdit && initialText) || undefined,
  );

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

    const finalText = (savedText || '').trim();

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
      <View style={styles.fieldWrap}>
        <Input
          testID="stepInput"
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
      </View>
      <BottomButton
        onPress={handleSaveStep}
        text={buttonText}
        testID="saveStepButton"
      />
    </View>
  );
};

const mapStateToProps = (
  { auth }: { auth: AuthState },
  {
    navigation: {
      state: {
        params: { personId },
      },
    },
    next,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  next,
  isMe: auth.person.id === personId,
});

export default connect(mapStateToProps)(AddStepScreen);
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
export const COMPLETE_STEP_SCREEN = 'nav/COMPLETE_STEP';
