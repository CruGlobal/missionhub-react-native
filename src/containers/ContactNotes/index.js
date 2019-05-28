import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Text, Flex, Input } from '../../components/common';
import { savePersonNote, getPersonNote } from '../../actions/person';
import NOTES from '../../../assets/images/myNotes.png';
import { buildTrackingObj } from '../../utils/common';
import { trackState } from '../../actions/analytics';
import NullStateComponent from '../../components/NullStateComponent';
import BottomButton from '../../components/BottomButton';
import { personSelector } from '../../selectors/people';

import styles from './styles';

@withTranslation('notes')
export class ContactNotes extends Component {
  state = {
    text: (this.props.person.person_note || {}).content,
    noteId: (this.props.person.person_note || {}).id,
    editing: false,
  };

  componentDidMount() {
    this.getNote();
  }

  UNSAFE_componentWillReceiveProps(props) {
    const {
      isActiveTab,
      person: { person_note },
    } = props;

    if (!isActiveTab) {
      this.saveNote();
    }

    if (person_note && !this.state.text) {
      const { id: noteId, content: text } = person_note;
      this.setState({ text, noteId });
    }
  }

  getNote() {
    const { dispatch, person } = this.props;

    dispatch(getPersonNote(person.id));
  }

  onTextChanged = text => {
    this.setState({ text });
  };

  saveNote = () => {
    const { editing, text, noteId } = this.state;
    const { dispatch, person } = this.props;

    Keyboard.dismiss();

    if (editing) {
      dispatch(savePersonNote(person.id, text, noteId));
    }

    this.setState({ editing: false });
  };

  onButtonPress = () => {
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
    }
  };

  getButtonText() {
    const { editing, text } = this.state;
    const { t } = this.props;

    if (editing) {
      return t('done');
    } else if (text) {
      return t('edit');
    } else {
      return t('add');
    }
  }

  inputRef = c => (this.notesInput = c);

  renderNotes() {
    const { editing, text } = this.state;

    if (editing) {
      return (
        <Flex value={1} style={styles.container}>
          <Input
            ref={this.inputRef}
            onChangeText={this.onTextChanged}
            editable={editing}
            value={text}
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
          <Text style={styles.notesText}>{text}</Text>
        </ScrollView>
      </Flex>
    );
  }

  renderEmpty() {
    const { t, person, isMe } = this.props;
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
    const { text, editing } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {text || editing ? this.renderNotes() : this.renderEmpty()}
        <BottomButton
          onPress={this.onButtonPress}
          text={this.getButtonText()}
        />
      </SafeAreaView>
    );
  }
}

ContactNotes.propTypes = {
  isActiveTab: PropTypes.bool,
  person: PropTypes.object.isRequired,
  organization: PropTypes.object,
};

const mapStateToProps = (
  { auth, people },
  { person: { id: personId }, organization: { id: orgId } },
) => {
  const person = personSelector({ people }, { personId, orgId });

  return {
    isMe: personId === auth.person.id,
    person,
  };
};

export default connect(mapStateToProps)(ContactNotes);
