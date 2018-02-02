import React, { Component } from 'react';
import { Dimensions, View, Keyboard, Image } from 'react-native';
import { connect } from 'react-redux';

import { Text, Flex, Button, Input } from '../../components/common';
import styles from './styles';
import PlatformKeyboardAvoidingView from '../../components/PlatformKeyboardAvoidingView';
import { saveNotes } from '../../actions/person';
import { translate } from 'react-i18next';
import NOTES from '../../../assets/images/myNotes.png';

@translate('notes')
export class ContactNotes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: undefined,
      keyboardHeight: undefined,
      editing: false,
    };

    this.saveNotes = this.saveNotes.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);
  }

  onTextChanged(text) {
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
    const t = this.props.t;

    if (this.state.editing) {
      return t('done');
    } else if (this.state.text) {
      return t('edit');
    } else {
      return t('add');
    }
  }

  onTextInputFocus() {
    this.setState({ editing: true });
  }

  onLayout(event) {
    if (!this.state.keyboardHeight) {
      const keyboardHeight = Dimensions.get('window').height - event.nativeEvent.layout.height;
      this.setState({ keyboardHeight });
    }
  }

  renderNotes() {
    return (
      <Input
        ref={(c) => this.notesInput = c}
        onChangeText={this.onTextChanged}
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
    const { t } = this.props;
    const text = t('prompt', { personFirstName: this.props.person.first_name });

    return (
      <Flex align="center" justify="center">
        <Image source={NOTES} />
        <Text type="header" style={styles.nullHeader}>{t('header').toUpperCase()}</Text>
        <Text style={styles.nullText}>{text}</Text>
      </Flex>
    );
  }

  render() {
    if (this.state.keyboardHeight) {
      return (
        <PlatformKeyboardAvoidingView offset={this.state.keyboardHeight}>
          <Flex align="stretch" justify="center" value={1} style={styles.container}>
            { (this.state.text || this.state.editing) ? this.renderNotes() : this.renderEmpty() }
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
}

export default connect()(ContactNotes);
