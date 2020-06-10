import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Keyboard, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useIsFocused, useNavigationParam } from 'react-navigation-hooks';

import { Text, Input } from '../../../components/common';
import { getAnalyticsAssignmentType } from '../../../utils/analytics';
import { savePersonNote, getPersonNote } from '../../../actions/person';
import NOTES from '../../../../assets/images/myNotes.png';
import NullStateComponent from '../../../components/NullStateComponent';
import BottomButton from '../../../components/BottomButton';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../../constants';
import { isAndroid } from '../../../utils/common';
import { CollapsibleViewContext } from '../../../components/CollapsibleView/CollapsibleView';
import { RootState } from '../../../reducers';
import { useIsMe } from '../../../utils/hooks/useIsMe';
import { personSelector } from '../../../selectors/people';

import styles from './styles';

export interface PersonNotesProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const PersonNotes = ({ collapsibleHeaderContext }: PersonNotesProps) => {
  const personId: string = useNavigationParam('personId');

  const person = useSelector(
    ({ people }: RootState) =>
      personSelector({ people }, { personId }) || {
        id: personId,
      },
  );

  const analyticsAssignmentType = useSelector(({ auth }: RootState) =>
    getAnalyticsAssignmentType(person, auth),
  );

  useAnalytics(['person', 'my notes'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });
  const { t } = useTranslation('notes');
  const dispatch = useDispatch<ThunkDispatch<{}, {}, AnyAction>>();
  const [text, setText] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const notesInput = useRef<TextInput>(null);

  const isMe = useIsMe(personId);
  const myUserId = useSelector(({ auth }: RootState) => auth.person.user.id);

  const getNote = async () => {
    const results = await dispatch(getPersonNote(personId, myUserId));

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
    <ScrollView
      style={{ flex: 1, marginBottom: isAndroid && editing ? 80 : undefined }}
      contentInset={{ bottom: 90 }}
      // @ts-ignore
      persistentScrollbar={true}
    >
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
        <Text
          style={[styles.notesText, isAndroid ? { paddingBottom: 80 } : null]}
        >
          {text}
        </Text>
      )}
    </ScrollView>
  );

  const renderEmpty = () => {
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

export const PERSON_NOTES = 'nav/PERSON_NOTES';
