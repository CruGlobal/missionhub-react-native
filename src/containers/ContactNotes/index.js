import React, { Component } from 'react';
import { Dimensions, Image, TextInput, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { Text, Flex, Button } from '../../components/common';
import styles from './styles';
import theme from '../../theme';
import PlatformKeyboardAvoidingView from '../../components/PlatformKeyboardAvoidingView';
import { saveNotes } from '../../actions/person';

class ContactNotes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: undefined,
      keyboardHeight: undefined,
      buttonText: 'ADD PRIVATE NOTES',
    };

    this.saveNotes = this.saveNotes.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
  }

  textChanged(text) {
    this.setState({ text: text });
  }

  saveNotes() {
    console.log('saving');
    this.props.dispatch(saveNotes(this.props.person.id, this.state.text));
  }

  onButtonPress() {
    if (this.state.text === undefined) {
      this.setState({ text: '', buttonText: 'DONE' });
      this.notesInput.focus();

    } else if (this.notesInput.isFocused()) {
      this.saveNotes();
      this.setState({ buttonText: 'EDIT PRIVATE NOTES' });
      Keyboard.dismiss();

    } else {
      this.notesInput.focus();
      this.setState({ buttonText: 'DONE' });
    }
  }

  renderNotes() {
    return (
      <TextInput
        ref={(c) => this.notesInput = c}
        onChangeText={(t) => this.textChanged(t)}
        value={this.state.text}
        style={styles.notesText}
        multiline={true}
        selectionColor={theme.primaryColor}
        returnKeyType="done"
        blurOnSubmit={true}
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
            { this.state.text === undefined ? this.renderEmpty() : this.renderNotes() }
          </Flex>
          <Flex justify="end">
            <Button
              type="secondary"
              onPress={this.onButtonPress}
              text={this.state.buttonText}
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
