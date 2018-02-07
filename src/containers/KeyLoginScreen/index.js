import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View, Image } from 'react-native';
import { translate } from 'react-i18next';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';
import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex, Icon } from '../../components/common';
import Input from '../../components/Input/index';
import { keyLogin, facebookLoginAction } from '../../actions/auth';
import BackButton from '../BackButton';
import LOGO from '../../../assets/images/missionHubLogoWords.png';


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
    };

    this.emailChanged = this.emailChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.login = this.login.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
  }

  emailChanged(email) {
    this.setState({ email });
  }

  passwordChanged(password) {
    this.setState({ password });
  }

  async login() {
    this.setState({ errorMessage: '' });

    try {
      await this.props.dispatch(keyLogin(this.state.email, this.state.password));
      Keyboard.dismiss();

    } catch (error) {
      const errorMessage = error.user_error;

      if (errorMessage) {
        this.setState({ errorMessage });
      }
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
    const { t } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        {this.state.errorMessage ? this.renderErrorMessage() : null }

        <BackButton />
        <Flex value={1} style={{ alignItems: 'center' }}>
          <Image source={LOGO} style={styles.logo} />
        </Flex>

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
          </View>
          {
            !this.state.email && !this.state.password ? (
              <Button
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
