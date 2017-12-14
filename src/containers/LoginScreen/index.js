import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';

import { firstTime, loginWithMinistries } from '../../actions/auth';
import { createMyPerson } from '../../actions/profile';
import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';

class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.loginMinistries = this.loginMinistries.bind(this);
    this.tryItNow = this.tryItNow.bind(this);
  }

  login() {
    this.props.dispatch(createMyPerson('Test', 'User1')).then(() => {
      this.navigateToNext();
    });
  }

  loginMinistries() {
    this.props.dispatch(createMyPerson('Test', 'User1')).then(() => {
      this.props.dispatch(loginWithMinistries(true));
      this.navigateToNext();
    });
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext();
  }

  navigateToNext() {
    this.props.dispatch(navigatePush('Welcome'));
  }

  render() {
    return (
      <Flex style={styles.container}>
        <Flex value={.5} />
        <Flex value={3} align="center" justify="center">
          <Flex align="center">
            <View style={{paddingBottom: 20}}>
              <Image source={require('../../../assets/images/missionhub_logo_circle.png')} />
            </View>
            <Text style={styles.text}>Grow closer to God.</Text>
            <Text style={styles.text}>Help others experience Him.</Text>
          </Flex>
          <Flex value={2} align="center" justify="end">
            <Button
              pill={true}
              type="primary"
              onPress={this.loginMinistries}
              text="SIGN UP WITH FACEBOOK"
              style={styles.facebookButton}
              buttonTextStyle={styles.buttonText}
            />
            <Button
              pill={true}
              onPress={this.tryItNow}
              text="TRY IT NOW"
              style={styles.tryButton}
              buttonTextStyle={styles.buttonText}
            />
          </Flex>
        </Flex>
        <Flex value={0.8} align="center" justify="center">
          <Button
            type="transparent"
            onPress={this.login}
            text="SIGN IN"
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
