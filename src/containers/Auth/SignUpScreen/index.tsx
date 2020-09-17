import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  ImageSourcePropType,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18Next from 'i18next';
import { connect } from 'react-redux-legacy';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Button, Flex, LoadingWheel } from '../../../components/common';
import DeprecatedBackButton from '../../DeprecatedBackButton';
import LOGO from '../../../../assets/images/missionHubLogoWords.png';
import PEOPLE from '../../../../assets/images/MemberContacts_light.png';
import TosPrivacy from '../../../components/TosPrivacy';
import Header from '../../../components/Header';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { RootState } from '../../../reducers';
import {
  SocialAuthButtons,
  SocialAuthButtonsType,
} from '../../../auth/components/SocialAuthButtons/SocialAuthButtons';
import { useAuth } from '../../../auth/useAuth';
import { AuthErrorNotice } from '../../../auth/components/AuthErrorNotice/AuthErrorNotice';

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
  dispatch: ThunkDispatch<RootState, never, AnyAction>;
  signUpType?: string;
  next: (params?: {
    signIn: boolean;
  }) => ThunkAction<void, RootState, never, AnyAction>;
}) => {
  useAnalytics([
    signUpType === SIGNUP_TYPES.CREATE_COMMUNITY ? 'communities' : 'menu',
    'sign up',
  ]);

  const { t } = useTranslation('loginOptions');

  const { authenticate, loading, error } = useAuth();

  const login = () => {
    dispatch(next({ signIn: true }));
  };

  const renderHeader = ({ image, title, description }: HeaderContentOption) => (
    <Flex
      value={1}
      align="center"
      justify="center"
      style={styles.headerContainer}
    >
      <Image source={image} />
      <Text style={styles.headerText}>{title.toUpperCase()}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </Flex>
  );

  const renderLogoHeader = () => <Image source={LOGO} />;

  const headerContent = signUpType ? headerContentOptions[signUpType] : null;

  return (
    <View style={styles.container}>
      <AuthErrorNotice error={error} />
      <Header left={<DeprecatedBackButton />} />
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
            <SocialAuthButtons
              testID="signUpSocialAuthButtons"
              type={SocialAuthButtonsType.SignUp}
              authenticate={async options => {
                await authenticate(options);
                dispatch(next());
              }}
            />
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
      {loading ? <LoadingWheel /> : null}
    </View>
  );
};

export default connect()(SignUpScreen);
export const SIGN_UP_SCREEN = 'nav/SIGN_UP_SCREEN';
