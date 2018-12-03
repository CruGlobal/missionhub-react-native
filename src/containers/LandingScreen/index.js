import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { translate } from 'react-i18next';

import { Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { JOIN_GROUP_SCREEN } from '../Groups/JoinGroupScreen';
import { LOGIN_OPTIONS_SCREEN } from '../LoginOptionsScreen';

import styles from './styles';

@translate('landing')
class LandingScreen extends Component {
  getStarted = () => {
    this.props.dispatch(navigatePush(LOGIN_OPTIONS_SCREEN));
  };

  communityCode = () => {
    this.props.dispatch(navigatePush(JOIN_GROUP_SCREEN));
  };

  signIn = () => {
    this.props.dispatch(navigatePush(KEY_LOGIN_SCREEN));
  };

  render() {
    const { t } = this.props;

    return (
      <Flex style={styles.container}>
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
            value={4}
            direction="column"
            justify="center"
            self="stretch"
            align="center"
          >
            <Button
              name={'getStartedButton'}
              pill={true}
              onPress={this.getStarted}
              text={t('getStarted').toUpperCase()}
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
            <Button
              name={'signInButton'}
              pill={true}
              onPress={this.signIn}
              text={t('signIn').toUpperCase()}
              style={styles.button}
              buttonTextStyle={styles.buttonText}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(LandingScreen);
export const LANDING_SCREEN = 'nav/LANDING';
