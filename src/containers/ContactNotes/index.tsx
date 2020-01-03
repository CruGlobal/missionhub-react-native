import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, Keyboard, TextInput } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';

import { Text, Flex, Input } from '../../components/common';
import { savePersonNote, getPersonNote } from '../../actions/person';
import NOTES from '../../../assets/images/myNotes.png';
import NullStateComponent from '../../components/NullStateComponent';
import BottomButton from '../../components/BottomButton';
import Analytics from '../Analytics';
import { Person } from '../../reducers/people';
import { AuthState } from '../../reducers/auth';

import styles from './styles';

interface ContactNotesProps {
  person: Person;
  myUserId: string;
  myPersonId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  isActiveTab: boolean;
}

interface NotesInterface {
  text: string | undefined;
  editing: boolean;
  noteId: string | null;
}

const ContactNotes = ({
  person,
  myUserId,
  myPersonId,
  dispatch,
  isActiveTab,
}: ContactNotesProps) => {
  const { t } = useTranslation('notes');

  const [note, setNote] = useState<NotesInterface>({
    text: undefined,
    editing: false,
    noteId: null,
  });

  const inputRef = useRef<TextInput>(null);

  const getNote = async () => {
    const results = await dispatch(getPersonNote(person.id, myUserId));
    const text = results ? results.content : undefined;
    const noteId = results ? results.id : null;
    setNote({ ...note, noteId, text });
  };

  const onTextChanged = (text: string) => {
    setNote({ ...note, text });
  };

  const onButtonPress = () => {
    if (note.editing) {
      saveNote();
    } else {
      setNote({ ...note, editing: true });
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
            testID={'NoteInput'}
            ref={inputRef}
            onChangeText={onTextChanged}
            editable={note.editing}
            value={note.text}
            style={styles.notesText}
            multiline={true}
            blurOnSubmit={false}
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
      <BottomButton
        testID={'EditNoteButton'}
        onPress={onButtonPress}
        text={getButtonText()}
      />
    </View>
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  myPersonId: auth.person.id,
  myUserId: auth.person.user.id,
});

export default connect(mapStateToProps)(ContactNotes);
