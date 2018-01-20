import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';
import { translate } from 'react-i18next';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';

import { firstTime, loginWithMinistries, facebookLoginAction } from '../../actions/auth';
import { createMyPerson } from '../../actions/profile';
import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';


const FACEBOOK_VERSION = 'v2.8';
const FACEBOOK_FIELDS = 'name,email,picture,about,cover,first_name,last_name';
const FACEBOOK_SCOPE = ['public_profile', 'email'];

@translate('login')
class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.loginMinistries = this.loginMinistries.bind(this);
    this.tryItNow = this.tryItNow.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
  }

  login() {
    this.navigateToNext('KeyLogin');
  }

  loginMinistries() {
    this.props.dispatch(createMyPerson('Test', 'User1')).then(() => {
      this.props.dispatch(loginWithMinistries(true));
      this.navigateToNext();
    });
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext('Welcome');
  }

  navigateToNext(nextScreen) {
    this.props.dispatch(navigatePush(nextScreen));
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
          this.props.dispatch(facebookLoginAction(accessToken)).then(() => {
            this.props.dispatch(navigatePush('GetStarted'));
          }).catch((e) => {
            LOG('err', e);
          });
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
        <Flex value={.5} />
        <Flex value={3} align="center" justify="center">
          <Flex align="center">
            <View style={{ paddingBottom: 20 }}>
              <Image source={require('../../../assets/images/missionhub_logo_circle.png')} />
            </View>
            <Text style={styles.text}>{t('tagline1')}</Text>
            <Text style={styles.text}>{t('tagline2')}</Text>
          </Flex>
          <Flex value={2} align="center" justify="end">
            <Button
              pill={true}
              type="primary"
              onPress={this.facebookLogin}
              text={t('facebookSignup').toUpperCase()}
              style={styles.facebookButton}
              buttonTextStyle={styles.buttonText}
            />
            <Button
              pill={true}
              onPress={this.tryItNow}
              text={t('tryNow').toUpperCase()}
              style={styles.tryButton}
              buttonTextStyle={styles.buttonText}
            />
          </Flex>
        </Flex>
        <Flex value={0.8} align="center" justify="center">
          <Button
            type="transparent"
            onPress={this.login}
            text={t('signIn').toUpperCase()}
            style={styles.signInButton}
            buttonTextStyle={styles.buttonText}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ myStageReducer }) => ({
  stageId: myStageReducer.stageId,
});

export default connect(mapStateToProps)(LoginScreen);
