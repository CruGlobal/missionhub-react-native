import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View, Image, Linking } from 'react-native';
import { translate } from 'react-i18next';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';
import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex, Icon } from '../../components/common';
import Input from '../../components/Input/index';
import { keyLogin, facebookLoginAction, createAccountAndLogin } from '../../actions/auth';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { trackAction } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import { navigateBack } from '../../actions/navigation';
import IconButton from '../../components/IconButton';
import { isAndroid, isiPhoneX } from '../../utils/common';
import { sha256 } from 'js-sha256';
import base64url from 'base64-url';
import { THE_KEY_URL } from '../../api/utils';
import { THE_KEY_CLIENT_ID } from '../../constants';
import randomString from 'random-string';
import Buffer from 'buffer';


const FACEBOOK_VERSION = 'v2.8';
const FACEBOOK_FIELDS = 'name,email,picture,about,cover,first_name,last_name';
const FACEBOOK_SCOPE = [ 'public_profile', 'email' ];

@translate('keyLogin')
class KeyLoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      logo: true,
    };

    this.emailChanged = this.emailChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.login = this.login.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
  }

  componentWillMount() {
    if (isAndroid) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._hideLogo);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._showLogo);
    } else {
      this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._hideLogo);
      this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._showLogo);
    }
  }

  componentWillUnmount() {
    if (isAndroid) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    } else {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    }
  }

  _hideLogo = () => {
    this.setState({ logo: false });
  };

  _showLogo = () => {
    this.setState({ logo: true });
  };

  emailChanged(email) {
    this.setState({ email });
  }

  passwordChanged(password) {
    this.setState({ password });
  }

  handleForgotPassword() {
    global.Buffer = global.Buffer || Buffer.Buffer;
    Linking.addEventListener('url', this.handleOpenURL);

    const string = randomString({ length: 50, numeric: true, letters: true, special: false });
    this.codeVerifier = base64url.encode(string);
    const codeChallenge = base64url.encode(sha256.array(this.codeVerifier));
    this.redirectUri = 'https://missionhub.com/auth';

    const uri = `${THE_KEY_URL}service/selfservice?target=displayForgotPassword&client_id=${THE_KEY_CLIENT_ID}`
      + `&response_type=code&redirect_uri=${this.redirectUri}&scope=fullticket+extended`
      + `&code_challenge_method=S256&code_challenge=${codeChallenge}`;


    Linking.openURL(uri);
  }

  handleOpenURL = (event) => {
    const code = event.url.split('code=')[1];
    this.props.dispatch(createAccountAndLogin(code, this.codeVerifier, this.redirectUri, null));
  };

  async login() {
    this.setState({ errorMessage: '' });

    try {
      await this.props.dispatch(keyLogin(this.state.email, this.state.password));
      Keyboard.dismiss();

    } catch (error) {
      const errorMessage = error.user_error;
      let action;

      if (errorMessage) {
        action = ACTIONS.USER_ERROR;
        this.setState({ errorMessage });

      } else {
        action = ACTIONS.SYSTEM_ERROR;
      }

      this.props.dispatch(trackAction(action));
    }
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

  renderErrorMessage() {
    return (
      <View style={styles.errorBar}>
        <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
      </View>
    );
  }

  render() {
    const { t, dispatch } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        {this.state.errorMessage ? this.renderErrorMessage() : null }

        <Flex value={.5} justify="center" style={{ alignSelf: 'flex-start', marginLeft: 25, marginTop: isiPhoneX() ? 60 : 7 }}>
          <IconButton
            name="backIcon"
            type="MissionHub"
            onPress={() => dispatch(navigateBack())}
          />
        </Flex>
        {
          this.state.logo ?
            <Flex value={1} align="center" justify="center">
              <Image source={LOGO} resizeMode="contain" />
            </Flex> : null
        }

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>
              {t('emailLabel')}
            </Text>
            <Input
              autoCapitalize="none"
              ref={(c) => this.email = c}
              onChangeText={this.emailChanged}
              value={this.state.email}
              returnKeyType="next"
              keyboardType="email-address"
              blurOnSubmit={false}
              onSubmitEditing={() => this.password.focus()}
              placeholder={t('emailLabel')}
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingVertical: 30 }}>
            <Text style={styles.label} >
              {t('passwordLabel')}
            </Text>
            <Input
              secureTextEntry={true}
              ref={(c) => this.password = c}
              onChangeText={this.passwordChanged}
              value={this.state.password}
              returnKeyType="next"
              placeholder={t('passwordLabel')}
              placeholderTextColor="white"
              blurOnSubmit={true}
            />
            <Button
              name={'forgotPasswordButton'}
              text={t('forgotPassword')}
              type="transparent"
              style={styles.forgotPasswordButton}
              buttonTextStyle={styles.forgotPasswordText}
              onPress={this.handleForgotPassword}
            />
          </View>
          {
            !this.state.email && !this.state.password ? (
              <Button
                name={'facebookButton'}
                pill={true}
                onPress={this.facebookLogin}
                style={styles.facebookButton}
                buttonTextStyle={styles.buttonText}
              >
                <Flex direction="row">
                  <Icon name="facebookIcon" size={21} type="MissionHub" style={styles.icon} />
                  <Text style={styles.buttonText}>{t('facebookLogin').toUpperCase()}</Text>
                </Flex>
              </Button>
            ) : null
          }
        </Flex>

        {
          !this.state.email && !this.state.password ? null : (
            <Flex value={1} align="stretch" justify="end">
              <Button
                name={'loginButton'}
                type="secondary"
                onPress={this.login}
                text={t('login').toUpperCase()}
              />
            </Flex>
          )
        }

      </PlatformKeyboardAvoidingView>
    );
  }
}

export default connect()(KeyLoginScreen);
export const KEY_LOGIN_SCREEN = 'nav/KEY_LOGIN';
