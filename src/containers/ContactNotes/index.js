import React, { Component } from 'react';
import { ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Text, Flex, Button, Input } from '../../components/common';
import PlatformKeyboardAvoidingView from '../../components/PlatformKeyboardAvoidingView';
import { savePersonNote, getPersonNote } from '../../actions/person';
import NOTES from '../../../assets/images/myNotes.png';
import { buildTrackingObj } from '../../utils/common';
import { trackState } from '../../actions/analytics';
import theme from '../../theme';
import NullStateComponent from '../../components/NullStateComponent';

import styles from './styles';

@translate('notes')
export class ContactNotes extends Component {
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

  componentWillMount() {
    this.getNote();
  }

  componentWillReceiveProps(props) {
    if (!props.isActiveTab) {
      this.saveNote();
    }
  }

  async getNote() {
    const { person, myId } = this.props;
    this.props.dispatch(getPersonNote(person.id, myId)).then(results => {
      const text = results ? results.content : undefined;
      const noteId = results ? results.id : null;
      this.setState({ noteId, text });
    });
  }

  onTextChanged(text) {
    this.setState({ text });
  }

  saveNote() {
    Keyboard.dismiss();

    if (this.state.editing) {
      this.props.dispatch(
        savePersonNote(
          this.props.person.id,
          this.state.text,
          this.state.noteId,
          this.props.myId,
        ),
      );
    }

    this.setState({ editing: false });
    this.props.onNotesInactive();
  }

  onButtonPress() {
    if (this.state.editing) {
      this.saveNote();
    } else {
      this.setState({ editing: true }, () => {
        this.notesInput.focus();
      });
      this.props.dispatch(
        trackState(
          buildTrackingObj(
            'people : person : notes : edit',
            'people',
            'person',
            'notes',
            'edit',
          ),
        ),
      );
      this.props.onNotesActive();
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

  inputRef = c => (this.notesInput = c);

  renderNotes() {
    if (this.state.editing) {
      return (
        <Flex value={1} style={styles.container}>
          <Input
            ref={this.inputRef}
            onChangeText={this.onTextChanged}
            editable={this.state.editing}
            value={this.state.text}
            style={styles.notesText}
            multiline={true}
            blurOnSubmit={false}
            autoGrow={false}
            autoCorrect={true}
          />
        </Flex>
      );
    }
    return (
      <Flex value={1} style={styles.container}>
        <ScrollView>
          <Text style={styles.notesText}>{this.state.text}</Text>
        </ScrollView>
      </Flex>
    );
  }

  renderEmpty() {
    const { t, person } = this.props;
    const text = t('prompt', { personFirstName: person.first_name });

    return (
      <NullStateComponent
        imageSource={NOTES}
        headerText={t('header').toUpperCase()}
        descriptionText={text}
      />
    );
  }

  render() {
    return (
      <PlatformKeyboardAvoidingView offset={theme.headerHeight}>
        {this.state.text || this.state.editing
          ? this.renderNotes()
          : this.renderEmpty()}
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.onButtonPress}
            text={this.getButtonText()}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

ContactNotes.propTypes = {
  onNotesActive: PropTypes.func,
  onNotesInactive: PropTypes.func,
};

const mapStateToProps = ({ auth }) => ({ myId: auth.person.user.id });

export default connect(mapStateToProps)(ContactNotes);
