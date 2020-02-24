import React from 'react';
import { SafeAreaView, Image, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { navigatePush } from '../../actions/navigation';
import { Button, Text } from '../../components/common';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import {
  FULL_ONBOARDING_FLOW,
  JOIN_BY_CODE_ONBOARDING_FLOW,
  SIGN_IN_FLOW,
} from '../../routes/constants';
import { startOnboarding } from '../../actions/onboarding';

import styles from './styles';

const {
  container,
  imageWrap,
  buttonWrap,
  pillButtonWrap,
  button,
  buttonText,
  signInWrap,
  memberText,
  signInBtnText,
} = styles;

const LandingScreen = () => {
  useAnalytics({ screenName: 'landing' });
  const { t } = useTranslation('landing');
  const dispatch = useDispatch();

  const tryItNow = () => {
    dispatch(startOnboarding());
    dispatch(navigatePush(FULL_ONBOARDING_FLOW));
  };

  const communityCode = () => {
    dispatch(startOnboarding());
    dispatch(navigatePush(JOIN_BY_CODE_ONBOARDING_FLOW));
  };

  const signIn = () => {
    dispatch(navigatePush(SIGN_IN_FLOW));
  };

  return (
    <View style={container}>
      <View style={imageWrap}>
        <Image source={LOGO} />
      </View>
      <View style={buttonWrap}>
        <View style={pillButtonWrap}>
          <Button
            testID={'tryItNowButton'}
            pill={true}
            onPress={tryItNow}
            text={t('getStarted').toUpperCase()}
            style={button}
            buttonTextStyle={buttonText}
          />
          <Button
            testID={'communityCodeButton'}
            pill={true}
            onPress={communityCode}
            text={t('haveCode').toUpperCase()}
            style={button}
            buttonTextStyle={buttonText}
          />
        </View>
        <SafeAreaView style={signInWrap}>
          <Text style={memberText}>{t('member').toUpperCase()}</Text>
          <Button
            testID={'signInButton'}
            text={t('signIn').toUpperCase()}
            type="transparent"
            onPress={signIn}
            buttonTextStyle={[buttonText, signInBtnText]}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};

export default LandingScreen;
export const LANDING_SCREEN = 'nav/LANDING';
