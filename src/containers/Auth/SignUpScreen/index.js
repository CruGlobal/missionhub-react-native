/* eslint max-lines-per-function: 0 */

import React, { Component } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import i18Next from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
import LOGO from '../../../../assets/images/missionHubLogoWords.png';
import PEOPLE from '../../../../assets/images/MemberContacts_light.png';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
} from '../../../actions/auth/facebook';
import Header from '../../Header';
import BackButton from '../../BackButton';
import TosPrivacy from '../../../components/TosPrivacy';

import styles from './styles';

export const SIGNUP_TYPES = {
  CREATE_COMMUNITY: 'login/CREATE_COMMUNITY',
  SETTINGS_MENU: 'login/SIDE_MENU',
};

const headerContentOptions = {
  [SIGNUP_TYPES.CREATE_COMMUNITY]: {
    image: PEOPLE,
    title: i18Next.t('loginOptions:createCommunityTitle'),
    description: i18Next.t('loginOptions:createCommunityDescription'),
  },
};

@translate('loginOptions')
class SignUpScreen extends Component {
  state = {
    isLoading: false,
  };

  login = () => {
    const { dispatch, next } = this.props;

    dispatch(next({ signIn: true }));
  };

  emailSignUp = async () => {
    const { dispatch, next } = this.props;

    const { code, codeVerifier, redirectUri } = await dispatch(
      openKeyURL('login?action=signup'),
    );
    this.setState({ isLoading: true });
    try {
      await dispatch(
        keyLoginWithAuthorizationCode(code, codeVerifier, redirectUri),
      );
      dispatch(next());
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  facebookLogin = async () => {
    const { dispatch, next } = this.props;

    try {
      await dispatch(facebookPromptLogin());
      this.setState({ isLoading: true });
      await dispatch(facebookLoginWithAccessToken());
      dispatch(next());
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  renderHeader = ({ image, title, description }) => (
    <Flex
      value={1}
      align="center"
      justify="center"
      style={styles.headerContainer}
    >
      <Image source={image} />
      <Text type="header" style={styles.headerText}>
        {title.toUpperCase()}
      </Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </Flex>
  );

  renderLogoHeader = () => <Image source={LOGO} />;

  render() {
    const { t, signUpType } = this.props;
    const { isLoading } = this.state;

    const headerContent = headerContentOptions[signUpType];

    return (
      <Flex style={styles.container}>
        <Header left={<BackButton />} />
        <Flex value={1} align="center" justify="center">
          <Flex value={1} align="center" justify="center">
            {headerContent
              ? this.renderHeader(headerContent)
              : this.renderLogoHeader()}
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
                name={'emailButton'}
                pill={true}
                onPress={this.emailSignUp}
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
                name={'facebookButton'}
                pill={true}
                onPress={this.facebookLogin}
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
            <Flex value={1} align="end" direction="row">
              <Text style={styles.signInText}>{t('member').toUpperCase()}</Text>
              <Button
                name={'loginButton'}
                text={t('signIn').toUpperCase()}
                type="transparent"
                onPress={this.login}
                buttonTextStyle={styles.signInBtnText}
              />
            </Flex>
          </Flex>
        </Flex>
        {isLoading ? <LoadingWheel /> : null}
      </Flex>
    );
  }
}

SignUpScreen.propTypes = {
  signUpType: PropTypes.string,
  next: PropTypes.func.isRequired,
};

export default connect()(SignUpScreen);
export const SIGN_UP_SCREEN = 'nav/SIGN_UP_SCREEN';
