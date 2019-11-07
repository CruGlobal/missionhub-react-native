/* eslint max-lines-per-function: 0 */

import React, { useState } from 'react';
import { SafeAreaView, View, Image, ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18Next from 'i18next';
import { connect } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import {
  keyLoginWithAuthorizationCode,
  openKeyURL,
} from '../../../actions/auth/key';
import {
  Text,
  Button,
  Flex,
  Icon,
  LoadingWheel,
} from '../../../components/common';
import BackButton from '../../BackButton';
import LOGO from '../../../../assets/images/missionHubLogoWords.png';
import PEOPLE from '../../../../assets/images/MemberContacts_light.png';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
} from '../../../actions/auth/facebook';
import TosPrivacy from '../../../components/TosPrivacy';
import Header from '../../../components/Header';

import styles from './styles';

export const SIGNUP_TYPES = {
  CREATE_COMMUNITY: 'login/CREATE_COMMUNITY',
  SETTINGS_MENU: 'login/SIDE_MENU',
};

interface HeaderContentOption {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const headerContentOptions: {
  [key: string]: HeaderContentOption;
} = {
  [SIGNUP_TYPES.CREATE_COMMUNITY]: {
    image: PEOPLE,
    title: i18Next.t('loginOptions:createCommunityTitle'),
    description: i18Next.t('loginOptions:createCommunityDescription'),
  },
};

const SignUpScreen = ({
  dispatch,
  signUpType,
  next,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  signUpType?: string;
  next: (params?: {
    signIn: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation('loginOptions');

  const login = () => {
    dispatch(next({ signIn: true }));
  };

  const emailSignUp = async () => {
    const { code, codeVerifier, redirectUri } = await dispatch(
      openKeyURL('login?action=signup'),
    );
    setIsLoading(true);
    try {
      await dispatch(
        keyLoginWithAuthorizationCode(code, codeVerifier, redirectUri),
      );
      dispatch(next());
    } catch (e) {
      setIsLoading(false);
    }
  };

  const facebookLogin = async () => {
    try {
      await dispatch(facebookPromptLogin());
      setIsLoading(true);
      await dispatch(facebookLoginWithAccessToken());
      dispatch(next());
    } catch (error) {
      setIsLoading(false);
    }
  };

  const renderHeader = ({ image, title, description }: HeaderContentOption) => (
    <Flex
      value={1}
      align="center"
      justify="center"
      style={styles.headerContainer}
    >
      <Image source={image} />
      <Text header={true} style={styles.headerText}>
        {title.toUpperCase()}
      </Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </Flex>
  );

  const renderLogoHeader = () => <Image source={LOGO} />;

  const headerContent = signUpType ? headerContentOptions[signUpType] : null;

  return (
    <View style={styles.container}>
      <Header left={<BackButton />} />
      <Flex value={1} align="center" justify="center">
        <Flex value={1} align="center" justify="center">
          {headerContent ? renderHeader(headerContent) : renderLogoHeader()}
        </Flex>
        <Flex
          value={1.2}
          align="center"
          justify="start"
          self="stretch"
          style={styles.buttonWrapper}
        >
          <Flex value={4} direction="column" self="stretch" align="center">
            <Button
              testID="emailButton"
              pill={true}
              onPress={emailSignUp}
              style={styles.clearButton}
              buttonTextStyle={styles.buttonText}
            >
              <Flex direction="row">
                <Icon
                  name="emailIcon2"
                  size={21}
                  type="MissionHub"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>
                  {t('emailSignUp').toUpperCase()}
                </Text>
              </Flex>
            </Button>
            <Button
              testID="facebookButton"
              pill={true}
              onPress={facebookLogin}
              style={styles.clearButton}
              buttonTextStyle={styles.buttonText}
            >
              <Flex direction="row">
                <Icon
                  name="facebookIcon"
                  size={21}
                  type="MissionHub"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>
                  {t('facebookSignup').toUpperCase()}
                </Text>
              </Flex>
            </Button>
            <TosPrivacy />
          </Flex>
        </Flex>
        <SafeAreaView
          style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}
        >
          <Text style={styles.signInText}>{t('member').toUpperCase()}</Text>
          <Button
            testID="loginButton"
            text={t('signIn').toUpperCase()}
            type="transparent"
            onPress={login}
            buttonTextStyle={styles.signInBtnText}
          />
        </SafeAreaView>
      </Flex>
      {isLoading ? <LoadingWheel /> : null}
    </View>
  );
};

export default connect()(SignUpScreen);
export const SIGN_UP_SCREEN = 'nav/SIGN_UP_SCREEN';
