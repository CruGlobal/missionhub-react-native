import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import i18Next from 'i18next';
import PropTypes from 'prop-types';

import { firstTime, openKeyURL } from '../../actions/auth';
import {
  Text,
  Button,
  Flex,
  Icon,
  LoadingWheel,
} from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import PEOPLE from '../../../assets/images/MemberContacts_light.png';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { WELCOME_SCREEN } from '../WelcomeScreen';
import { onSuccessfulLogin } from '../../actions/login';
import { facebookLoginWithUsernamePassword } from '../../actions/facebook';
import Header from '../Header';
import BackButton from '../BackButton';
import TosPrivacy from '../../components/TosPrivacy';

import styles from './styles';

export const LOGIN_TYPES = {
  CREATE_COMMUNITY: 'login/CREATE_COMMUNITY',
  UPGRADE_ACCOUNT: 'login/UPGRADE_ACCOUNT',
};

const headerContentOptions = {
  [LOGIN_TYPES.CREATE_COMMUNITY]: {
    image: PEOPLE,
    title: i18Next.t('createCommunityTitle'),
    description: i18Next.t('createCommunityDescription'),
  },
};

@translate('loginOptions')
class LoginOptionsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      isLoading: false,
    };

    this.login = this.login.bind(this);
    this.tryItNow = this.tryItNow.bind(this);
    this.emailSignUp = this.emailSignUp.bind(this);
  }

  login() {
    this.props.dispatch(
      navigatePush(KEY_LOGIN_SCREEN, {
        upgradeAccount: this.props.loginType === LOGIN_TYPES.UPGRADE_ACCOUNT,
      }),
    );
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.props.dispatch(navigatePush(WELCOME_SCREEN));
  }

  startLoad = () => {
    this.setState({ isLoading: true });
  };

  emailSignUp() {
    const { dispatch, loginType } = this.props;
    dispatch(
      openKeyURL(
        'login?action=signup',
        this.startLoad,
        loginType === LOGIN_TYPES.UPGRADE_ACCOUNT,
      ),
    );
  }

  facebookLogin = async () => {
    const { dispatch, loginType } = this.props;
    const result = await dispatch(
      facebookLoginWithUsernamePassword(
        loginType === LOGIN_TYPES.UPGRADE_ACCOUNT,
        this.startLoad,
        onSuccessfulLogin,
      ),
    );

    if (result) {
      this.setState({ isLoading: true });
    } else {
      this.setState({ isLoading: false });
    }
  };

  renderHeader = () => {
    const { t } = this.props;
    return (
      <Flex
        value={1}
        align="center"
        justify="center"
        style={styles.headerContainer}
      >
        <Image source={PEOPLE} />
        <Text type="header" style={styles.headerText}>
          {t('createCommunityTitle').toUpperCase()}
        </Text>
        <Text style={styles.descriptionText}>
          {t('createCommunityDescription')}
        </Text>
      </Flex>
    );
  };

  renderLogoHeader = () => <Image source={LOGO} />;

  render() {
    const { t, loginType } = this.props;

    const headerContent = headerContentOptions[loginType];

    return (
      <Flex style={styles.container}>
        <Header left={<BackButton />} />
        <Flex value={1} align="center" justify="center">
          <Flex value={1} align="center" justify="center">
            {headerContent ? this.renderHeader() : this.renderLogoHeader()}
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
        {this.state.isLoading ? <LoadingWheel /> : null}
      </Flex>
    );
  }
}

LoginOptionsScreen.propTypes = {
  loginType: PropTypes.string,
};

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(LoginOptionsScreen);
export const LOGIN_OPTIONS_SCREEN = 'nav/LOGIN_OPTIONS';
