import React, { Component } from 'react';
import { Dimensions, View, Keyboard, Image } from 'react-native';
import { connect } from 'react-redux';

import { Text, Flex, Button, Input } from '../../components/common';
import styles from './styles';
import PlatformKeyboardAvoidingView from '../../components/PlatformKeyboardAvoidingView';
import { savePersonNotes, getPersonNotes } from '../../actions/person';
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
    this.onTextChanged = this.onTextChanged.bind(this);
  }

  async componentWillMount() {
    this.getNotes();
  }

  componentWillReceiveProps(props) {
    if (!props.isActiveTab) {
      this.saveNotes();
    }
  }

  onTextChanged(text) {
    this.setState({ text });
  }

  getNotes() {
    const { noteId, person } = this.props;
    if (noteId) {
      return this.props.dispatch(getPersonNotes(person.id, noteId)).then((results) => {
        this.setState({ text: results ? results.content : undefined });
      });
    }
    this.setState({ text: undefined });
  }

  saveNotes() {
    Keyboard.dismiss();

    if (this.state.editing) {
      this.props.dispatch(savePersonNotes(this.props.person.id, this.state.text, this.props.noteId));
    }

    this.setState({ editing: false });
  }

  onButtonPress() {
    if (this.state.editing) {
      this.saveNotes();
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
        editable={this.state.editing}
        value={this.state.text}
        style={styles.notesText}
        multiline={true}
        returnKeyType="next"
        blurOnSubmit={false}
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


const mapStateToProps = ({ personProfile }) => ({ noteId: personProfile.noteId });


export default connect(mapStateToProps)(ContactNotes);
