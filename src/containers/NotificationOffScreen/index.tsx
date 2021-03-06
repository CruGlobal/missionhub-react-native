import React, { useEffect, useState } from 'react';
import { Linking, Image, View, Text } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useAppState } from 'react-native-hooks';
import { AnyAction } from 'redux';

import { Button } from '../../components/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { requestNativePermissions } from '../../actions/notifications';
import { navigateBack } from '../../actions/navigation';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { RootState } from '../../reducers';

import styles from './styles';

const {
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

interface NotificationOffScreenProps {
  dispatch: ThunkDispatch<RootState, never, AnyAction>;
  next?: () => ThunkAction<void, RootState, never, AnyAction>;
}

const NotificationOffScreen = ({
  dispatch,
  next,
}: NotificationOffScreenProps) => {
  const { t } = useTranslation('notificationOff');
  const onComplete:
    | (({
        nativePermissionsEnabled,
        showedPrompt,
      }: {
        nativePermissionsEnabled: boolean;
        showedPrompt: boolean;
      }) => void)
    | undefined = useNavigationParam('onComplete');
  const notificationType: NOTIFICATION_PROMPT_TYPES = useNavigationParam(
    'notificationType',
  );
  const [settingsOpened, setSettingsOpened] = useState(false);
  const appState = useAppState();

  useAnalytics('notifications off');

  const close = async (returnFromSettings: boolean) => {
    const { nativePermissionsEnabled } = await dispatch(
      requestNativePermissions(),
    );

    if (returnFromSettings && !nativePermissionsEnabled) {
      return;
    }

    next
      ? dispatch(next())
      : onComplete
      ? onComplete({ nativePermissionsEnabled, showedPrompt: true })
      : dispatch(navigateBack());
  };

  const onReturnFromSettings = () => close(true);

  useEffect(() => {
    if (appState === 'background') {
      setSettingsOpened(true);
    }
    if (appState === 'active' && settingsOpened) {
      close(true);
      setSettingsOpened(false);
    }
  }, [appState]);

  const notNow = () => {
    close(false);
    dispatch(trackActionWithoutData(ACTIONS.NO_REMINDERS));
  };

  const goToSettings = () => {
    return Linking.openSettings();
  };

  useEffect(() => {
    Linking.addEventListener('url', onReturnFromSettings);

    return () => Linking.removeEventListener('url', onReturnFromSettings);
  }, []);

  const descriptionText = t(
    notificationType === JOIN_COMMUNITY
      ? 'joinCommunity'
      : notificationType === JOIN_CHALLENGE
      ? 'joinChallenge'
      : 'defaultDescription',
  );
  const notNowButtonText = t(
    notificationType === SET_REMINDER ? 'noReminders' : 'notNow',
  );

  const {
    container,
    imageWrap,
    title,
    text,
    buttonWrap,
    button,
    allowButton,
    notNowButton,
    buttonText,
  } = styles;

  return (
    <View style={container}>
      <View style={imageWrap}>
        <Image source={require('../../../assets/images/notificationOff.png')} />
      </View>
      <Text style={title}>{t('title')}</Text>
      <Text style={text}>{descriptionText}</Text>
      <View style={buttonWrap}>
        <Button
          testID="allowButton"
          pill={true}
          type="primary"
          onPress={goToSettings}
          text={t('settings').toUpperCase()}
          style={[button, allowButton]}
          buttonTextStyle={buttonText}
        />
        <Button
          testID="notNowButton"
          pill={true}
          onPress={notNow}
          text={notNowButtonText.toUpperCase()}
          style={[button, notNowButton]}
          buttonTextStyle={buttonText}
        />
      </View>
    </View>
  );
};

export default connect()(NotificationOffScreen);
export const NOTIFICATION_OFF_SCREEN = 'nav/NOTIFICATION_OFF';
