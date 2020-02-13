import React, { useEffect, useState } from 'react';
import { Linking, Image, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useAppState } from 'react-native-hooks';

import { Text, Button } from '../../components/common';
import { isAndroid } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { requestNativePermissions } from '../../actions/notifications';
import { navigateBack } from '../../actions/navigation';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../constants';

import styles from './styles';

const {
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

interface NotificationOffScreenProps {
  dispatch: ThunkDispatch<{}, null, never>;
  next?: () => ThunkAction<void, {}, null, never>;
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

  const close = async () => {
    let nativePermissionsEnabled = false;
    try {
      const response = await dispatch(requestNativePermissions());
      nativePermissionsEnabled = response.nativePermissionsEnabled;
    } finally {
      next
        ? dispatch(next())
        : onComplete
        ? onComplete({ nativePermissionsEnabled, showedPrompt: true })
        : dispatch(navigateBack());
    }
  };

  useEffect(() => {
    if (appState === 'background') {
      setSettingsOpened(true);
    }
    if (appState === 'active' && settingsOpened) {
      close();
      setSettingsOpened(false);
    }
  }, [appState]);

  const notNow = () => {
    close();
    dispatch(trackActionWithoutData(ACTIONS.NO_REMINDERS));
  };

  const goToSettings = async () => {
    if (!isAndroid) {
      const APP_SETTINGS_URL = 'app-settings:';
      const isSupported = await Linking.canOpenURL(APP_SETTINGS_URL);

      if (isSupported) {
        return Linking.openURL(APP_SETTINGS_URL);
      }
    }

    close();
  };

  useEffect(() => {
    Linking.addEventListener('url', close);

    return () => Linking.removeEventListener('url', close);
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
