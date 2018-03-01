import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Linking } from 'react-native';
import { translate } from 'react-i18next';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';

import { firstTime, facebookLoginAction, createKeyAccount } from '../../actions/auth';
import styles from './styles';
import { Text, Button, Flex, Icon } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { LINKS, THE_KEY_CLIENT_ID } from '../../constants';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { WELCOME_SCREEN } from '../WelcomeScreen';
import { sha256 } from 'js-sha256';
import base64url from 'base64-url';
import randomString from 'random-string';

const FACEBOOK_VERSION = 'v2.8';
const FACEBOOK_FIELDS = 'name,email,picture,about,cover,first_name,last_name';
const FACEBOOK_SCOPE = [ 'public_profile', 'email' ];

@translate('loginOptions')
class LoginOptionsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
    };

    this.login = this.login.bind(this);
    this.tryItNow = this.tryItNow.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
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
    global.Buffer = global.Buffer || require('buffer').Buffer;
    Linking.addEventListener('url', this.handleOpenURL);

    const string = randomString({ length: 50, numeric: true, letters: true, special: false });
    this.codeVerifier = base64url.encode(string);
    const codeChallenge = base64url.encode(sha256.array(this.codeVerifier));
    this.redirectUri = 'https://missionhub.com/auth';

    const uri = `https://thekey.me/cas/login?action=signup&client_id=${THE_KEY_CLIENT_ID}&response_type=code`
      + `&redirect_uri=${this.redirectUri}&scope=fullticket%20extended&code_challenge_method=S256`
      + `&code_challenge=${codeChallenge}`;

    Linking.openURL(uri);
  }

  handleOpenURL = (event) => {
    const code = event.url.split('code=')[1];
    this.props.dispatch(createKeyAccount(code, this.codeVerifier, this.redirectUri));
  };

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  facebookLogin() {
    LoginManager.logInWithReadPermissions(FACEBOOK_SCOPE).then((result) => {
      LOG('Facebook login result', result);
      if (result.isCancelled) {
        return;
      }
      AccessToken.getCurrentAccessToken().then((data) => {
        if (!data.accessToken) {
          LOG('facebook access token doesnt exist');
          return;
        }
        const accessToken = data.accessToken.toString();
        const getMeConfig = {
          version: FACEBOOK_VERSION,
          accessToken,
          parameters: {
            fields: {
              string: FACEBOOK_FIELDS,
            },
          },
        };
        // Create a graph request asking for user information with a callback to handle the response.
        const infoRequest = new GraphRequest('/me', getMeConfig, (err, meResult) => {
          if (err) {
            LOG('error getting facebook user', err);
            return;
          }
          LOG('facebook me', meResult);
          this.props.dispatch(facebookLoginAction(accessToken, meResult.id));
        });
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
      });
    }, (err) => {
      LOG('err', err);
      LoginManager.logOut();
    }).catch(() => {
      LOG('facebook login manager catch');
    });
  }

  render() {
    const { t } = this.props;

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
                onPress={this.emailSignUp}
                style={styles.facebookButton}
                buttonTextStyle={styles.buttonText}
              >
                <Flex direction="row">
                  <Icon name="emailIcon2" size={21} type="MissionHub" style={styles.icon} />
                  <Text style={styles.buttonText}>{t('emailSignUp').toUpperCase()}</Text>
                </Flex>
              </Button>
              <Button
                pill={true}
                onPress={this.tryItNow}
                text={t('tryNow').toUpperCase()}
                style={styles.tryButton}
                buttonTextStyle={styles.buttonText}
              />
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

export default connect()(LoginOptionsScreen);
export const LOGIN_OPTIONS_SCREEN = 'nav/LOGIN_OPTIONS';
