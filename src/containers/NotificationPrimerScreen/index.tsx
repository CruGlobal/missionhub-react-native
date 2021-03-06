import React from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux-legacy';
import { Image, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { Button, Flex } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import {
  hasShownPrompt,
  requestNativePermissions,
} from '../../actions/notifications';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { RootState } from '../../reducers';

import styles from './styles';

const {
  LOGIN,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

interface NotificationPrimerScreenProps {
  dispatch: ThunkDispatch<RootState, never, AnyAction>;
  next?: () => ThunkAction<void, RootState, never, AnyAction>;
}

const NotificationPrimerScreen = ({
  dispatch,
  next,
}: NotificationPrimerScreenProps) => {
  useAnalytics('allow notifications');
  const { t } = useTranslation('notificationPrimer');
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

  const close = (nativePermissionsEnabled: boolean) => {
    next
      ? dispatch(next())
      : onComplete
      ? onComplete({ nativePermissionsEnabled, showedPrompt: true })
      : dispatch(navigateBack());
  };

  const notNow = () => {
    close(false);
    dispatch(trackActionWithoutData(ACTIONS.NOT_NOW));
  };

  const allow = async () => {
    let nativePermissionsEnabled = false;
    try {
      dispatch(hasShownPrompt());
      const response = await dispatch(requestNativePermissions());
      nativePermissionsEnabled = response.nativePermissionsEnabled;
    } finally {
      close(nativePermissionsEnabled);
      dispatch(trackActionWithoutData(ACTIONS.ALLOW));
    }
  };

  const descriptionText = () => {
    switch (notificationType) {
      case LOGIN:
        return t('login');
      case SET_REMINDER:
        return t('setReminder');
      case JOIN_COMMUNITY:
        return t('joinCommunity');
      case JOIN_CHALLENGE:
        return t('joinChallenge');
      default:
        return t('stepsNotification');
    }
  };
  const renderNotification = () => {
    if (notificationType === NOTIFICATION_PROMPT_TYPES.ONBOARDING) {
      return (
        <Flex style={styles.container}>
          <Flex value={0.3} />
          <Flex value={1} align="center" justify="center">
            <Flex
              value={0.6}
              align="center"
              justify="center"
              style={styles.stepsNotificationContainer}
            >
              <View>
                <Text style={styles.stepsNotificationText}>
                  {t('stepsNotification.part1')}
                </Text>
                <Text style={styles.stepsNotificationText}>
                  {t('stepsNotification.part2')}
                </Text>
              </View>
            </Flex>
            <Flex
              value={1}
              align="center"
              justify="center"
              style={styles.stepsNotificationContainer}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../../assets/images/notificationPrimerScreen.png')}
                />
                <Image
                  style={styles.stepsNotifcationImage}
                  source={require('../../../assets/images/notificationPrimerNotif.png')}
                />
              </View>
            </Flex>
            <Flex
              value={1}
              align="center"
              justify="center"
              style={styles.buttonContainer}
            >
              <Button
                testID="AllowButton"
                pill={true}
                type="primary"
                onPress={allow}
                text={t('allow').toUpperCase()}
                style={styles.allowButton}
                buttonTextStyle={styles.buttonText}
              />
              <Button
                testID="NotNowButton"
                pill={true}
                onPress={notNow}
                text={t('notNow').toUpperCase()}
                style={styles.notNowButton}
                buttonTextStyle={styles.buttonText}
              />
            </Flex>
          </Flex>
          <Flex value={0.3} />
        </Flex>
      );
    } else {
      return (
        <Flex style={styles.container}>
          <Flex value={0.3} />
          <Flex value={1} align="center" justify="center">
            <Flex value={1} align="center" justify="center">
              <Image
                source={require('../../../assets/images/notificationPrimer.png')}
              />
            </Flex>
            <Flex value={0.6} align="center" justify="center">
              <Text style={styles.text}>{descriptionText()}</Text>
            </Flex>
            <Flex value={1} align="center" justify="center">
              <Button
                testID="AllowButton"
                pill={true}
                type="primary"
                onPress={allow}
                text={t('allow').toUpperCase()}
                style={styles.allowButton}
                buttonTextStyle={styles.buttonText}
              />
              <Button
                testID="NotNowButton"
                pill={true}
                onPress={notNow}
                text={t('notNow').toUpperCase()}
                style={styles.notNowButton}
                buttonTextStyle={styles.buttonText}
              />
            </Flex>
          </Flex>
          <Flex value={0.3} />
        </Flex>
      );
    }
  };
  return renderNotification();
};

export default connect()(NotificationPrimerScreen);
export const NOTIFICATION_PRIMER_SCREEN = 'nav/NOTIFICATION_PRIMER';
