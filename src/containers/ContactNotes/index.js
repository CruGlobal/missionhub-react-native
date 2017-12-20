import React, { Component } from 'react';
import { Dimensions, Image, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { Text, Flex, Button, Input } from '../../components/common';
import styles from './styles';
import PlatformKeyboardAvoidingView from '../../components/PlatformKeyboardAvoidingView';
import { saveNotes } from '../../actions/person';

export class ContactNotes extends Component {

  constructor(props) {
    super(props);

    this.notesInput = {
      focus: () => ({}),
    };

    this.state = {
      text: undefined,
      keyboardHeight: undefined,
      editing: false,
      buttonText: 'ADD PRIVATE NOTES',
    };

    this.saveNotes = this.saveNotes.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
  }

  textChanged(text) {
    this.setState({ text });
  }

  saveNotes() {
    if (this.state.text) {
      this.props.dispatch(saveNotes(this.props.person.id, this.state.text));
    }
  }

  onButtonPress() {
    if (this.state.editing) {
      this.setState({ editing: false });
      this.saveNotes();
      Keyboard.dismiss();

    } else {
      this.setState({ editing: true });
      this.notesInput.focus();
    }
  }

  getButtonText() {
    if (this.state.editing) {
      return 'DONE';
    } else if (this.state.text) {
      return 'EDIT PRIVATE NOTES';
    } else {
      return 'ADD PRIVATE NOTES';
    }
  }

  onTextInputFocus() {
    this.setState({ editing: true });
  }

  renderNotes() {
    return (
      <Input
        ref={(c) => this.notesInput = c}
        onChangeText={(t) => this.textChanged(t)}
        value={this.state.text}
        style={styles.notesText}
        multiline={true}
        returnKeyType="next"
        blurOnSubmit={false}
        onFocus={this.onTextInputFocus}
      />
    );
  }

  renderEmpty() {
    const text = 'Remember important details about '
      + this.props.person.personFirstName
      + ', like favorite food, hobbies they love or something interesting they said.';

    return (
      <Flex align="center" justify="center">
        <Image source={require('../../../assets/images/notesIcon.png')} />
        <Text type="header" style={styles.nullHeader}>MY NOTES</Text>
        <Text style={styles.nullText}>{text}</Text>
      </Flex>
    );
  }

  render() {
    if (this.state.keyboardHeight) {
      return (
        <PlatformKeyboardAvoidingView offset={this.state.keyboardHeight}>
          <Flex align="stretch" justify="center" value={1} style={styles.container}>
            { (this.state.text || this.state.editing) ?  this.renderNotes() : this.renderEmpty() }
          </Flex>
          <Flex justify="end">
            <Button
              type="secondary"
              onPress={this.onButtonPress}
              text={this.getButtonText()}
            />
          </Flex>
        </PlatformKeyboardAvoidingView>
      );
    } else {
      return (
        <View style={{ flex: 1 }} onLayout={this.onLayout} />
      );
    }
  }

  onLayout(event) {
    if (!this.state.keyboardHeight) {
      const keyboardHeight = Dimensions.get('window').height - event.nativeEvent.layout.height;
      this.setState({ keyboardHeight });
    }
  }
}

export default connect()(ContactNotes);
