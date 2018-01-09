import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View } from 'react-native';
import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../../components/common';
import Input from '../../components/Input/index';
import { keyLogin } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';
import BackButton from '../BackButton';
import { ANALYTICS } from '../../constants';
import * as RNOmniture from 'react-native-omniture';

class KeyLoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.usernameChanged = this.usernameChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.login = this.login.bind(this);
  }

  usernameChanged(username) {
    this.setState({ username });
  }

  passwordChanged(password) {
    this.setState({ password });
  }

  login() {
    this.props.dispatch(keyLogin(this.state.username, this.state.password)).then(() => {
      Keyboard.dismiss();

      RNOmniture.syncMarketingCloudId(this.props.mcId);
      this.props.dispatch(navigatePush('GetStarted'));
    });
  }

  render() {
    return (
      <PlatformKeyboardAvoidingView>
        <BackButton />
        <Flex value={1} style={{ alignItems: 'center' }}>
          <Text type="header" style={styles.header}>please enter username and password</Text>
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>
              Username
            </Text>
            <Input
              ref={(c) => this.username = c}
              onChangeText={this.usernameChanged}
              value={this.state.username}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.password.focus()}
              placeholder="Username"
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingTop: 30 }}>
            <Text style={styles.label} >
              Password
            </Text>
            <Input
              secureTextEntry={true}
              ref={(c) => this.password = c}
              onChangeText={this.passwordChanged}
              value={this.state.password}
              returnKeyType="next"
              placeholder="Password"
              placeholderTextColor="white"
              blurOnSubmit={true}
            />
          </View>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.login}
            text="LOGIN"
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ analytics }) => ({
  mcId: analytics[ANALYTICS.MCID],
});

export default connect(mapStateToProps)(KeyLoginScreen);
