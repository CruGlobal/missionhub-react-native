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
      noteId: null,
    };

    this.getNoteId = this.getNoteId.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);
  }

  componentWillMount() {
    this.getNoteId();
  }


  componentWillReceiveProps(props) {
    if (!props.isActiveTab) {
      this.saveNotes();
    }
    this.getNoteId();
  }

  getNoteId() {
    console.log('Get Note Id');
    const { noteIds, person } = this.props;
    const entry = noteIds.find((el) => { return el.personId === person.id; });
    const noteId = entry ? entry.noteId : null;
    console.log(`noteId: ${noteId}`);
    this.getNotes(noteId);
  }

  async getNotes(noteId) {
    console.log('Get Notes');
    const { person } = this.props;
    if (noteId) {
      console.log('there is a noteId');
      return this.props.dispatch(getPersonNotes(person.id, noteId)).then((results) => {
        console.log('note: ', results);
        const text = results ? results.content : undefined;
        console.log(`setState: noteId: ${noteId} text: ${text}`);
        this.setState({ noteId, text });
      });
    } else {
      console.log('setState: bad');
      this.setState({ noteId: null, text: undefined });
    }

  }

  onTextChanged(text) {
    this.setState({ text });
  }

  saveNotes() {
    Keyboard.dismiss();

    if (this.state.editing) {
      console.log('save person notes');
      this.props.dispatch(savePersonNotes(this.props.person.id, this.state.text, this.state.noteId));
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


const mapStateToProps = ({ people }) => ({ noteIds: people.noteIds });


export default connect(mapStateToProps)(ContactNotes);
