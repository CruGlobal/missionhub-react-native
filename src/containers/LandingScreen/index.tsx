import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { SafeAreaView, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { navigatePush } from '../../actions/navigation';
import { firstTime } from '../../actions/auth/userData';
import { Button, Text } from '../../components/common';
import { WELCOME_SCREEN } from '../WelcomeScreen';
import {
  JOIN_BY_CODE_ONBOARDING_FLOW,
  SIGN_IN_FLOW,
} from '../../routes/constants';

import styles from './styles';

const {
  container,
  buttonWrapper,
  pillButtonWrapper,
  button,
  buttonText,
  memberText,
  signInBtnText,
} = styles;

const LandingScreen = ({
  dispatch,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, any>;
}) => {
  const { t } = useTranslation('landing');

  tryItNow = () => {
    dispatch(firstTime());
    dispatch(navigatePush(WELCOME_SCREEN));
  };

  communityCode = () => {
    dispatch(navigatePush(JOIN_BY_CODE_ONBOARDING_FLOW));
  };

  signIn = () => {
    dispatch(navigatePush(SIGN_IN_FLOW));
  };

  return (
    <SafeAreaView style={container}>
      <View alignSelf="center" justifyContent="center" position="absolute">
        <Image source={LOGO} />
      </View>
      <View
        flex={1}
        alignItems="center"
        justifyContent="flex-end"
        alignSelf="stretch"
        style={buttonWrapper}
      >
        <View
          flew={2}
          flexDirection="column"
          justifyContent="center"
          alignSelf="stretch"
          alignItems="center"
          style={pillButtonWrapper}
        >
          <Button
            name={'tryItNowButton'}
            pill={true}
            onPress={tryItNow}
            text={t('getStarted').toUpperCase()}
            style={button}
            buttonTextStyle={buttonText}
          />
          <Button
            name={'communityCodeButton'}
            pill={true}
            onPress={communityCode}
            text={t('haveCode').toUpperCase()}
            style={button}
            buttonTextStyle={buttonText}
          />
        </View>
        <View alignItems="flex-end" flexDirection="row">
          <Text style={memberText}>{t('member').toUpperCase()}</Text>
          <Button
            name={'signInButton'}
            text={t('signIn').toUpperCase()}
            type="transparent"
            onPress={signIn}
            buttonTextStyle={[buttonText, signInBtnText]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default connect()(LandingScreen);
export const LANDING_SCREEN = 'nav/LANDING';
