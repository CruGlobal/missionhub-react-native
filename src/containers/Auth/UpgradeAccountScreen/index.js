/* eslint max-lines-per-function: 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, Image } from 'react-native';
import { translate } from 'react-i18next';
import i18Next from 'i18next';
import PropTypes from 'prop-types';

import { openKeyURL } from '../../../actions/auth';
import {
  Text,
  Button,
  Flex,
  Icon,
  LoadingWheel,
} from '../../../components/common';
import { navigatePush } from '../../../actions/navigation';
import LOGO from '../../../../assets/images/missionHubLogoWords.png';
import PEOPLE from '../../../../assets/images/MemberContacts_light.png';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { onSuccessfulLogin } from '../../../actions/login';
import { facebookLoginWithUsernamePassword } from '../../../actions/facebook';
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
class UpgradeAccountScreen extends Component {
  state = {
    isLoading: false,
  };

  login = () => {
    const { dispatch, onComplete } = this.props;

    dispatch(
      navigatePush(KEY_LOGIN_SCREEN, {
        upgradeAccount: true,
        next: onComplete,
      }),
    );
  };

  startLoad = () => {
    this.setState({ isLoading: true });
  };

  emailSignUp = () => {
    const { dispatch, onComplete } = this.props;

    dispatch(
      openKeyURL('login?action=signup', this.startLoad, true, onComplete),
    );
  };

  facebookLogin = async () => {
    const { dispatch, onComplete } = this.props;

    const result = await dispatch(
      facebookLoginWithUsernamePassword(true, this.startLoad, () =>
        onSuccessfulLogin(onComplete),
      ),
    );

    this.setState({ isLoading: !!result });
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
    const { t, signupType } = this.props;
    const { isLoading } = this.state;

    const headerContent = headerContentOptions[signupType];

    return (
      <SafeAreaView style={styles.container}>
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
        <BackButton absolute={true} />
      </SafeAreaView>
    );
  }
}

UpgradeAccountScreen.propTypes = {
  signupType: PropTypes.string,
};

const mapStateToProps = (_, { navigation }) => {
  const { signupType, onComplete } = navigation.state.params || {};

  return { signupType, onComplete };
};

export default connect(mapStateToProps)(UpgradeAccountScreen);
export const UPGRADE_ACCOUNT_SCREEN = 'nav/UPGRADE_ACCOUNT';
