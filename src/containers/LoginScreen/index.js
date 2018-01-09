import React from 'react';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';
import { translate } from 'react-i18next';

import { firstTime, loginWithMinistries } from '../../actions/auth';
import { createMyPerson } from '../../actions/profile';
import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import BaseScreen from '../../components/BaseScreen';

@translate('login')
class LoginScreen extends BaseScreen {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.loginMinistries = this.loginMinistries.bind(this);
    this.tryItNow = this.tryItNow.bind(this);
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
              onPress={this.loginMinistries}
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
