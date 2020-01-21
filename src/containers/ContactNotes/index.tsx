import React, { Component } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Text, Flex, Input } from '../../components/common';
import { savePersonNote, getPersonNote } from '../../actions/person';
import NOTES from '../../../assets/images/myNotes.png';
import NullStateComponent from '../../components/NullStateComponent';
import BottomButton from '../../components/BottomButton';
import Analytics from '../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('notes')
export class ContactNotes extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);

    this.state = {
      text: undefined,
      editing: false,
      noteId: null,
    };

    this.saveNote = this.saveNote.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);
  }

  componentDidMount() {
    this.getNote();
  }

  // @ts-ignore
  UNSAFE_componentWillReceiveProps(props) {
    if (!props.isActiveTab) {
      this.saveNote();
    }
  }

  async getNote() {
    // @ts-ignore
    const { person, myUserId } = this.props;

    // @ts-ignore
    const results = await this.props.dispatch(
      getPersonNote(person.id, myUserId),
    );

    const text = results ? results.content : undefined;
    const noteId = results ? results.id : null;
    this.setState({ noteId, text });
  }

  // @ts-ignore
  onTextChanged(text) {
    this.setState({ text });
  }

  saveNote() {
    Keyboard.dismiss();

    // @ts-ignore
    if (this.state.editing) {
      // @ts-ignore
      this.props.dispatch(
        savePersonNote(
          // @ts-ignore
          this.props.person.id,
          // @ts-ignore
          this.state.text,
          // @ts-ignore
          this.state.noteId,
          // @ts-ignore
          this.props.myUserId,
        ),
      );
    }

    this.setState({ editing: false });
  }

  onButtonPress() {
    // @ts-ignore
    if (this.state.editing) {
      this.saveNote();
    } else {
      this.setState({ editing: true }, () => {
        // @ts-ignore
        this.notesInput.focus();
      });
    }
  }

  getButtonText() {
    // @ts-ignore
    const t = this.props.t;

    // @ts-ignore
    if (this.state.editing) {
      return t('done');
      // @ts-ignore
    } else if (this.state.text) {
      return t('edit');
    } else {
      return t('add');
    }
  }

  // @ts-ignore
  inputRef = c => (this.notesInput = c);

  renderNotes() {
    // @ts-ignore
    if (this.state.editing) {
      return (
        <Flex value={1}>
          <Input
            ref={this.inputRef}
            onChangeText={this.onTextChanged}
            // @ts-ignore
            editable={this.state.editing}
            // @ts-ignore
            value={this.state.text}
            style={styles.notesText}
            multiline={true}
            blurOnSubmit={false}
            // @ts-ignore
            autoGrow={false}
            autoCorrect={true}
          />
        </Flex>
      );
    }
    return (
      <Flex value={1}>
        <ScrollView>
          // @ts-ignore
          <Text style={styles.notesText}>{this.state.text}</Text>
        </ScrollView>
      </Flex>
    );
  }

  renderEmpty() {
    // @ts-ignore
    const { t, person, myPersonId } = this.props;
    const isMe = person.id === myPersonId;
    const text = t(isMe ? 'promptMe' : 'prompt', {
      personFirstName: person.first_name,
    });

    return (
      <NullStateComponent
        imageSource={NOTES}
        headerText={t('header').toUpperCase()}
        descriptionText={text}
      />
    );
  }

  render() {
    // @ts-ignore
    const { text, editing } = this.state;
    return (
      <View style={styles.container}>
        <Analytics screenName={['person', 'my notes']} />
        {text || editing ? this.renderNotes() : this.renderEmpty()}
        <BottomButton
          onPress={this.onButtonPress}
          text={this.getButtonText()}
        />
      </View>
    );
  }
}

// @ts-ignore
ContactNotes.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object,
};

// @ts-ignore
const mapStateToProps = ({ auth }) => ({
  myPersonId: auth.person.id,
  myUserId: auth.person.user.id,
});

export default connect(mapStateToProps)(ContactNotes);
