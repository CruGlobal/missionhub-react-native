import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Linking } from 'react-native';
import { translate } from 'react-i18next';

import { firstTime, openKeyURL } from '../../actions/auth';
import { Text, Button, Flex, Icon, LoadingWheel } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { LINKS } from '../../constants';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { WELCOME_SCREEN } from '../WelcomeScreen';
import { onSuccessfulLogin } from '../../actions/login';
import { facebookLoginWithUsernamePassword } from '../../actions/facebook';

import styles from './styles';


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
    this.navigateToNext(KEY_LOGIN_SCREEN, { upgradeAccount: this.props.upgradeAccount });
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext(WELCOME_SCREEN);
  }

  navigateToNext(nextScreen, props = {} ) {
    this.props.dispatch(navigatePush(nextScreen, props));
  }

  startLoad = () => {
    this.setState({ isLoading: true });
  };

  emailSignUp() {
    this.props.dispatch(openKeyURL('login?action=signup', this.startLoad, this.props.upgradeAccount));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  facebookLogin = () => {
    const { dispatch, upgradeAccount } = this.props;
    dispatch(facebookLoginWithUsernamePassword(upgradeAccount || false, this.startLoad, onSuccessfulLogin)).then((result) => {
      if (result) {
        this.setState({ isLoading: true });
      } else {
        this.setState({ isLoading: false });
      }
    });
  };

  render() {
    const { t, upgradeAccount } = this.props;

    return (
      <Flex style={styles.container}>
        <Flex value={1} align="center" justify="center">
          <Flex value={1} align="center" justify="center">
            <Image source={LOGO} />
          </Flex>
          <Flex value={1.2} align="center" justify="start" self="stretch" style={styles.buttonWrapper}>
            <Flex value={4} direction="column" self="stretch" align="center">
              <Button
                name={'facebookButton'}
                pill={true}
                onPress={this.facebookLogin}
                style={styles.facebookButton}
                buttonTextStyle={styles.buttonText}
              >
                <Flex direction="row">
                  <Icon name="facebookIcon" size={21} type="MissionHub" style={styles.icon} />
                  <Text style={styles.buttonText}>{t('facebookSignup').toUpperCase()}</Text>
                </Flex>
              </Button>
              <Button
                name={'emailButton'}
                pill={true}
                onPress={() => this.emailSignUp(upgradeAccount || false)}
                style={styles.facebookButton}
                buttonTextStyle={styles.buttonText}
              >
                <Flex direction="row">
                  <Icon name="emailIcon2" size={21} type="MissionHub" style={styles.icon} />
                  <Text style={styles.buttonText}>{t('emailSignUp').toUpperCase()}</Text>
                </Flex>
              </Button>
              {
                upgradeAccount ? null : (
                  <Button
                    name={'tryItNowButton'}
                    pill={true}
                    onPress={this.tryItNow}
                    text={t('tryNow').toUpperCase()}
                    style={styles.tryButton}
                    buttonTextStyle={styles.buttonText}
                  />
                )
              }
              <Flex direction="column">
                <Text style={styles.termsText}>{t('terms')}</Text>
                <Flex direction="row" align="center" justify="center">
                  <Button
                    text={t('tos')}
                    type="transparent"
                    onPress={() => Linking.openURL(LINKS.terms)}
                    buttonTextStyle={styles.termsTextLink}
                  />
                  <Text style={styles.termsText}>{t('and')}</Text>
                  <Button
                    text={t('privacy')}
                    type="transparent"
                    onPress={() => Linking.openURL(LINKS.terms)}
                    buttonTextStyle={styles.termsTextLink}
                  />
                </Flex>
              </Flex>

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
        {this.state.isLoading ? <LoadingWheel /> : null }
      </Flex>
    );
  }
}

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});


export default connect(mapStateToProps)(LoginOptionsScreen);
export const LOGIN_OPTIONS_SCREEN = 'nav/LOGIN_OPTIONS';
