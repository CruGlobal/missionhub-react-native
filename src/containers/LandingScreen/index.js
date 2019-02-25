import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, Image } from 'react-native';
import { translate } from 'react-i18next';

import { Button, Flex, Text } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { KEY_LOGIN_SCREEN } from '../Auth/KeyLoginScreen';
import { WELCOME_SCREEN } from '../WelcomeScreen';
import { firstTime } from '../../actions/auth';
import { JOIN_BY_CODE_ONBOARDING_FLOW } from '../../routes/constants';

import styles from './styles';

@translate('landing')
class LandingScreen extends Component {
  tryItNow = () => {
    this.props.dispatch(firstTime());
    this.props.dispatch(navigatePush(WELCOME_SCREEN));
  };

  communityCode = () => {
    this.props.dispatch(navigatePush(JOIN_BY_CODE_ONBOARDING_FLOW));
  };

  signIn = () => {
    this.props.dispatch(navigatePush(KEY_LOGIN_SCREEN));
  };

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Flex align="center" justify="end" style={styles.imageWrap}>
          <Image source={LOGO} />
        </Flex>
        <Flex
          value={1}
          align="center"
          justify="center"
          self="stretch"
          style={styles.buttonWrapper}
        >
          <Flex
            value={2}
            direction="column"
            justify="center"
            self="stretch"
            align="center"
          >
            <Button
              name={'tryItNowButton'}
              pill={true}
              onPress={this.tryItNow}
              text={t('tryItNow').toUpperCase()}
              style={styles.button}
              buttonTextStyle={styles.buttonText}
            />
            <Button
              name={'communityCodeButton'}
              pill={true}
              onPress={this.communityCode}
              text={t('haveCode').toUpperCase()}
              style={styles.button}
              buttonTextStyle={styles.buttonText}
            />
          </Flex>
          <Flex align="end" direction="row">
            <Text style={styles.memberText}>{t('member').toUpperCase()}</Text>
            <Button
              name={'signInButton'}
              text={t('signIn').toUpperCase()}
              type="transparent"
              onPress={this.signIn}
              buttonTextStyle={[styles.buttonText, styles.signInBtnText]}
            />
          </Flex>
        </Flex>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(LandingScreen);
export const LANDING_SCREEN = 'nav/LANDING';
