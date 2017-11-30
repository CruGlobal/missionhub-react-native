import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import styles from './styles';

import { navigateBack } from '../../actions/navigation';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../../components/common';
import Input from '../../components/Input/index';
import BackButton from '../BackButton';

class AddStepScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: '',
    };

    this.saveStep = this.saveStep.bind(this);
  }

  saveStep() {
    Keyboard.dismiss();
    // TODO: Save to my steps
    this.props.dispatch(navigateBack());
  }

  render() {
    return (
      <PlatformKeyboardAvoidingView>
        <BackButton />
        <Flex value={1.5} align="center" justify="center">
          <Text type="header" style={styles.header}>My Step of Faith</Text>
        </Flex>

        <Flex value={1} style={styles.fieldWrap}>
          <Input
            ref={(c) => this.stepInput = c}
            onChangeText={(t) => this.setState({ step: t })}
            value={this.state.step}
            autoFocus={true}
            returnKeyType="done"
            blurOnSubmit={true}
            style={styles.input}
            placeholder="Invite a friend"
          />
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.saveStep}
            text="CREATE STEP"
            style={styles.createButton}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

export default connect()(AddStepScreen);
