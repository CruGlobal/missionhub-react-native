import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View } from 'react-native';
import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../../components/common';
import Input from '../../components/Input/index';
import { keyLogin } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';
import BackButton from '../BackButton';
import { getPeopleList } from '../../actions/people';
import { findAllNonPlaceHolders } from '../../utils/common';

class KeyLoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.emailChanged = this.emailChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.login = this.login.bind(this);
  }

  emailChanged(email) {
    this.setState({ email });
  }

  passwordChanged(password) {
    this.setState({ password });
  }

  login() {
    this.props.dispatch(keyLogin(this.state.email, this.state.password)).then((response) => {
      Keyboard.dismiss();

      if (response.findAll('user')[0].pathway_stage_id) {
        this.props.dispatch(getPeopleList()).then((response) => {
          if (this.hasPersonWithStageSelected(response)) {
            this.props.dispatch(navigatePush('MainTabs'));
          } else {
            this.props.dispatch(navigatePush('AddSomeone'));
          }
        });

      } else {
        this.props.dispatch(navigatePush('GetStarted'));
      }
    });
  }

  hasPersonWithStageSelected(jsonApiResponse) {
    const people = findAllNonPlaceHolders(jsonApiResponse, 'person');

    return !!people.find((person) => {
      return !!person.reverse_contact_assignments[0].pathway_stage_id;
    });
  }

  render() {
    return (
      <PlatformKeyboardAvoidingView>
        <BackButton />
        <Flex value={1} style={{ alignItems: 'center' }}>
          <Text type="header" style={styles.header}>please enter email and password</Text>
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>
              Email
            </Text>
            <Input
              ref={(c) => this.email = c}
              onChangeText={this.emailChanged}
              value={this.state.email}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.password.focus()}
              placeholder="Email"
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

export default connect()(KeyLoginScreen);
