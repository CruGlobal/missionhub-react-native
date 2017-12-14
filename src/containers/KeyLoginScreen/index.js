import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Keyboard, View} from 'react-native';
import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../../components/common';
import Input from '../../components/Input/index';
import {keyLogin} from '../../actions/auth';
import {navigatePush} from '../../actions/navigation';

class KeyLoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  usernameChanged(username) {
    this.setState({ username: username});
  }

  passwordChanged(password) {
    this.setState({ password: password});
  }

  login() {
    this.props.dispatch(keyLogin(this.state.username, this.state.password)).then(() => {
      Keyboard.dismiss();
      this.props.dispatch(navigatePush('GetStarted'));
    });
  }

  render() {
    return (
      <PlatformKeyboardAvoidingView>
        <Flex value={1} />
        <Flex value={2} style={{alignItems: 'center'}}>
          <Text type="header" style={styles.header}>please enter username and password</Text>
        </Flex>

        <Flex value={3} style={{padding: 30}}>
          <View>
            <Text style={styles.label} >
              Username
            </Text>
            <Input
              ref={(c) => this.username = c}
              onChangeText={(t) => this.usernameChanged(t)}
              value={this.state.username}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.password.focus()}
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="white"
            />
          </View>

          <View style={{paddingTop: 30}}>
            <Text style={styles.label} >
              Password
            </Text>
            <Input
              secureTextEntry={true}
              ref={(c) => this.password = c}
              onChangeText={(t) => this.passwordChanged(t)}
              value={this.state.password}
              returnKeyType="next"
              placeholder="Password"
              placeholderTextColor="white"
              blurOnSubmit={true}
              style={styles.input}
            />
          </View>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => this.login()}
            text="LOGIN"
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

export default connect()(KeyLoginScreen);
