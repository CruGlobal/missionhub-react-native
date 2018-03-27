import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Linking, ActivityIndicator } from 'react-native';
import { translate } from 'react-i18next';

import { firstTime, openKeyURL } from '../../actions/auth';
import styles from './styles';
import { Text, Button, Flex, Icon } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { LINKS } from '../../constants';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { WELCOME_SCREEN } from '../WelcomeScreen';
import { onSuccessfulLogin } from '../../actions/login';
import { facebookLoginWithUsernamePassword } from '../../actions/facebook';
import theme from '../../theme';


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
    this.navigateToNext(KEY_LOGIN_SCREEN);
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext(WELCOME_SCREEN);
  }

  navigateToNext(nextScreen) {
    this.props.dispatch(navigatePush(nextScreen));
  }

  emailSignUp() {
    this.props.dispatch(openKeyURL('login?action=signup', this.props.upgradeAccount)).then(() => {
      this.setState({ isLoading: true });
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  facebookLogin = () => {
    const { dispatch, upgradeAccount } = this.props;
    dispatch(facebookLoginWithUsernamePassword(upgradeAccount ? upgradeAccount : false, onSuccessfulLogin)).then(() => {
      this.setState({ isLoading: true });
    });
  };

  renderLoading() {
    return (
      <Flex value={1} style={{ justifyContent: 'center', width: 2 }}>
        <ActivityIndicator size="small" color={theme.white} />
      </Flex>
    );
  }

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
                pill={true}
                onPress={() => this.emailSignUp(upgradeAccount ? upgradeAccount : false)}
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
              {this.renderLoading()}
            </Flex>

            <Flex value={1} align="end" direction="row">
              <Text style={styles.signInText}>{t('member').toUpperCase()}</Text>
              <Button
                text={t('signIn').toUpperCase()}
                type="transparent"
                onPress={this.login}
                buttonTextStyle={styles.signInBtnText}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ( reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});


export default connect(mapStateToProps)(LoginOptionsScreen);
export const LOGIN_OPTIONS_SCREEN = 'nav/LOGIN_OPTIONS';
