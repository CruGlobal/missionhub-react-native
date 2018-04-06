import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View, Image } from 'react-native';
import { translate } from 'react-i18next';
import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex, Icon, LoadingWheel } from '../../components/common';
import Input from '../../components/Input/index';
import { keyLogin, openKeyURL, upgradeAccount } from '../../actions/auth';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { trackAction } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import { navigateBack } from '../../actions/navigation';
import IconButton from '../../components/IconButton';
import { isAndroid, isiPhoneX } from '../../utils/common';
import { onSuccessfulLogin } from '../../actions/login';
import { facebookLoginWithUsernamePassword } from '../../actions/facebook';

@translate('keyLogin')
class KeyLoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      logo: true,
      isLoading: false,
    };

    this.emailChanged = this.emailChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.login = this.login.bind(this);
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

  startLoad = () => {
    this.setState({ isLoading: true });
  };

  handleForgotPassword = () => {
    const { dispatch, upgradeAccount } = this.props;
    dispatch(openKeyURL('service/selfservice?target=displayForgotPassword', this.startLoad, upgradeAccount ? upgradeAccount : false));
  };

  async login() {
    const { email, password } = this.state;
    const { dispatch, upgradeAccount } = this.props;
    this.setState({ errorMessage: '', isLoading: true });

    try {
      await dispatch(keyLogin(encodeURIComponent(email), encodeURIComponent(password), upgradeAccount ? upgradeAccount : false));
      Keyboard.dismiss();

    } catch (error) {
      const errorMessage = error.user_error;
      let action;

      if (errorMessage) {
        action = ACTIONS.USER_ERROR;
        this.setState({ errorMessage, isLoading: false });

      } else {
        action = ACTIONS.SYSTEM_ERROR;
        this.setState({ isLoading: false });
      }

      dispatch(trackAction(action));
    }
  }

  facebookLogin = () => {
    const { dispatch, upgradeAccount } = this.props;
    dispatch(facebookLoginWithUsernamePassword(upgradeAccount ? upgradeAccount : false, this.startLoad, onSuccessfulLogin)).then((result) => {
      if (result) {
        this.setState({ isLoading: true });
      } else {
        this.setState({ isLoading: false });
      }
    });
  };

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
            <Flex align="stretch" justify="end">
              <Button
                name={'loginButton'}
                type="secondary"
                onPress={this.login}
                text={t('login').toUpperCase()}
              />
            </Flex>
          )
        }
        {this.state.isLoading ? <LoadingWheel /> : null }
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(KeyLoginScreen);
export const KEY_LOGIN_SCREEN = 'nav/KEY_LOGIN';
