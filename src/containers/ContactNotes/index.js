import React, { Component } from 'react';
import { Dimensions, Image, TextInput, View } from 'react-native';
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
      text: null,
      viewHeight: undefined,
    };

    this.saveNotes = this.saveNotes.bind(this);
    this.onLayout = this.onLayout.bind(this);
  }

  textChanged(text) {
    this.setState({ text: text });
  }

  saveNotes() {
    this.props.dispatch(saveNotes(this.props.person.id, this.state.text));
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
    if (this.state.viewHeight) {
      return (
        <PlatformKeyboardAvoidingView offset={this.state.viewHeight}>
          <Flex align="stretch" justify="center" value={1} style={styles.container}>
            { this.state.text === null ? this.renderEmpty() : this.renderNotes() }
          </Flex>
          <Flex justify="end">
            { this.state.text === null ? this.getAddButton() : this.getEditButton() }
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
    if (!this.state.viewHeight) {
      const viewHeight = Dimensions.get('window').height - event.nativeEvent.layout.height;
      this.setState({ viewHeight });
    }
  }

  getAddButton() {
    const onPressFunction = () => {
      this.setState({ text: '' });
      this.notesInput.focus();
    };

    return (
      <Button
        type="secondary"
        onPress={onPressFunction}
        text="ADD PRIVATE NOTES"
      />
    );
  }

  getEditButton() {
    return (
      <Button
        type="secondary"
        onPress={this.saveNotes}
        text="EDIT PRIVATE NOTES"
      />
    );
  }
}

export default connect()(ContactNotes);
