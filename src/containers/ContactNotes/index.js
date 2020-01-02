import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux-legacy';

import { useTranslation } from 'react-i18next';

import { Text, Flex, Input } from '../../components/common';
import { savePersonNote, getPersonNote } from '../../actions/person';
import NOTES from '../../../assets/images/myNotes.png';
import NullStateComponent from '../../components/NullStateComponent';
import BottomButton from '../../components/BottomButton';
import Analytics from '../Analytics';

import styles from './styles';

const ContactNotes = ({
  person,
  myUserId,
  myPersonId,
  dispatch,
  isActiveTab,
}) => {
  const { t } = useTranslation('notes');

  const [note, setNote] = useState({
    text: undefined,
    editing: false,
    noteId: null,
  });

  const inputRef = useRef();

  const getNote = async () => {
    const results = await dispatch(getPersonNote(person.id, myUserId));
    const text = results ? results.content : undefined;
    const noteId = results ? results.id : null;
    setNote({ noteId, text });
  };

  const onTextChanged = text => {
    setNote({ ...note, text });
  };

  const onButtonPress = () => {
    if (note.editing) {
      saveNote();
    } else {
      setNote({ ...note, editing: true }),
        () => {
          inputRef.focus();
        };
    }
  };

  const saveNote = () => {
    Keyboard.dismiss();

    if (note.editing) {
      dispatch(savePersonNote(person.id, note.text, note.noteId, myUserId));
    }
    setNote({ ...note, editing: false });
  };

  const getButtonText = () => {
    if (note.editing) {
      return t('done');
    } else if (note.text) {
      return t('edit');
    } else {
      return t('add');
    }
  };

  useEffect(() => {
    getNote();
    if (!isActiveTab) {
      saveNote();
    }
  }, [isActiveTab]);

  const renderNotes = () => {
    if (note.editing) {
      return (
        <Flex value={1}>
          <Input
            ref={inputRef}
            onChangeText={onTextChanged}
            editable={note.editing}
            value={note.text}
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
      <Flex value={1}>
        <ScrollView>
          <Text style={styles.notesText}>{note.text}</Text>
        </ScrollView>
      </Flex>
    );
  };

  const renderEmpty = () => {
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
  };

  return (
    <View style={styles.container}>
      <Analytics screenName={['person', 'my notes']} />
      {note.text || note.editing ? renderNotes() : renderEmpty()}
      <BottomButton onPress={onButtonPress} text={getButtonText()} />
    </View>
  );
};

const mapStateToProps = ({ auth }) => ({
  myPersonId: auth.person.id,
  myUserId: auth.person.user.id,
});

export default connect(mapStateToProps)(ContactNotes);
