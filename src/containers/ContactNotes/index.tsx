import React, { useState, useEffect, useRef } from 'react';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { View, ScrollView, Keyboard, TextInput } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from 'react-navigation-hooks';

import { Text, Input } from '../../components/common';
import { getAnalyticsAssignmentType } from '../../utils/common';
import { TrackStateContext } from '../../actions/analytics';
import { savePersonNote, getPersonNote } from '../../actions/person';
import NOTES from '../../../assets/images/myNotes.png';
import NullStateComponent from '../../components/NullStateComponent';
import BottomButton from '../../components/BottomButton';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { Person } from '../../reducers/people';
import { AuthState } from '../../reducers/auth';
import { Organization } from '../../reducers/organizations';
import { orgPermissionSelector } from '../../selectors/people';

import styles from './styles';

export interface ContactNotesProps {
  person: Person;
  myPersonId: string;
  myUserId: string;
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const ContactNotes = ({
  person,
  myPersonId,
  myUserId,
  analyticsAssignmentType,
}: ContactNotesProps) => {
  useAnalytics({
    screenName: ['person', 'my notes'],
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });
  const { t } = useTranslation('notes');
  const dispatch = useDispatch<ThunkDispatch<{}, {}, AnyAction>>();
  const [text, setText] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const notesInput = useRef<TextInput>(null);

  const getNote = async () => {
    const results = await dispatch(getPersonNote(person.id, myUserId));

    setText(results ? results.content : undefined);
    setNoteId(results ? results.id : null);
  };

  const saveNote = () => {
    Keyboard.dismiss();

    editing && dispatch(savePersonNote(person.id, text, noteId, myUserId));

    setEditing(false);
  };

  useEffect(() => {
    getNote();
  }, []);

  useEffect(() => {
    !isFocused && saveNote();
  }, [isFocused]);

  const onTextChanged = (text: string) => setText(text);

  const onButtonPress = () => {
    if (editing) {
      saveNote();
    } else {
      setEditing(true);
      notesInput.current && notesInput.current.focus();
    }
  };

  const getButtonText = () => {
    if (editing) {
      return t('done');
    } else if (text) {
      return t('edit');
    } else {
      return t('add');
    }
  };

  const renderNotes = () => (
    <ScrollView style={{ flex: 1 }} contentInset={{ bottom: 90 }}>
      {editing ? (
        <Input
          ref={notesInput}
          scrollEnabled={false}
          onChangeText={onTextChanged}
          editable={true}
          value={text}
          style={styles.notesText}
          multiline={true}
          blurOnSubmit={false}
          autoCorrect={true}
        />
      ) : (
        <Text style={styles.notesText}>{text}</Text>
      )}
    </ScrollView>
  );

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
      {text || editing ? renderNotes() : renderEmpty()}
      <BottomButton onPress={onButtonPress} text={getButtonText()} />
    </View>
  );
};

const mapStateToProps = (
  { auth }: { auth: AuthState },
  { person, organization }: { person: Person; organization: Organization },
) => {
  const orgPermission = orgPermissionSelector({}, { person, organization });

  return {
    myPersonId: auth.person.id,
    myUserId: auth.person.user.id,
    analyticsAssignmentType: getAnalyticsAssignmentType(
      person.id,
      auth,
      orgPermission,
    ),
  };
};

export default connect(mapStateToProps)(ContactNotes);
