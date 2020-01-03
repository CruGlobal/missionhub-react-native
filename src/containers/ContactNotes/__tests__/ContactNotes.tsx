import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { getPersonNote, savePersonNote } from '../../../actions/person';

import ContactNotes from '..';

const props = {
  dispatch: jest.fn(response => Promise.resolve(response)),
  person: { id: '141234', first_name: 'Roger', user: { id: '1234' } },
  myUserId: '1',
  note: { id: '988998', content: 'Roge rules' },
  isActiveTab: false,
};

const person = { id: '141234', first_name: 'Roger', user: { id: '1234' } };

jest.mock('react-native-device-info');
jest.mock('../../../actions/person');
beforeEach(() => {
  (getPersonNote as jest.Mock).mockReturnValue(() =>
    Promise.resolve(props.note),
  );
  (savePersonNote as jest.Mock).mockReturnValue(() => {});
});

describe('contact notes', () => {
  const noNotes = {
    dispatch: jest.fn(response => Promise.resolve(response)),
    person: { id: '141234', first_name: 'Roger', user: { id: '1234' } },
    isActiveTab: false,
  };
  const noNotesMe = {
    dispatch: jest.fn(response => Promise.resolve(response)),
    person: { id: '141234', first_name: 'Roger', user: { id: '1234' } },
    myUserId: '1',
    isActiveTab: false,
  };

  it('icon and prompt are shown if no notes', () => {
    const { snapshot } = renderWithContext(<ContactNotes {...noNotes} />, {
      initialState: {
        auth: {
          person,
        },
      },
    });
    snapshot();
  });
  it('icon and prompt are shown if no notes as me', () => {
    const { snapshot } = renderWithContext(<ContactNotes {...noNotesMe} />, {
      initialState: {
        auth: {
          person,
        },
      },
    });

    snapshot();
  });
  it('should render the input when the add private notes button is clicked', () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ContactNotes {...props} />,
      {
        initialState: {
          auth: {
            person,
          },
        },
      },
    );

    expect(getByTestId('EditNoteButton')).toBeTruthy();
    getByTestId('EditNoteButton').props.onPress();
    snapshot();
    expect(getByTestId('NoteInput')).toBeTruthy();
  });
  it('should be able to edit the note', () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ContactNotes {...props} />,
      {
        initialState: {
          auth: {
            person,
          },
        },
      },
    );

    expect(getByTestId('EditNoteButton')).toBeTruthy();
    getByTestId('EditNoteButton').props.onPress();
    getByTestId('NoteInput').props.onChangeText(props.note.content);
    expect(getByTestId('NoteInput').props.value).toEqual('Roge rules');
    snapshot();
  });
  it('Should say Done when editing the note', () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ContactNotes {...props} />,
      {
        initialState: {
          auth: {
            person,
          },
        },
      },
    );
    getByTestId('EditNoteButton').props.onPress();
    expect(getByTestId('EditNoteButton').props.text).toEqual('Done');
    snapshot();
  });
  it('Should setNote if the user didnt edit the note', () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ContactNotes {...props} />,
      {
        initialState: {
          auth: {
            person,
          },
        },
      },
    );
    getByTestId('EditNoteButton').props.onPress();
    expect(getByTestId('EditNoteButton').props.text).toEqual('Done');
    getByTestId('EditNoteButton').props.onPress();
    expect(getByTestId('EditNoteButton').props.text).toEqual(
      'ADD PRIVATE NOTES',
    );
    snapshot();
  });
  it('Should say Edit Private Notes after clicking Done button', () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ContactNotes {...props} />,
      {
        initialState: {
          auth: {
            person,
          },
        },
      },
    );
    getByTestId('EditNoteButton').props.onPress();
    getByTestId('NoteInput').props.onChangeText(props.note.content);
    expect(getByTestId('EditNoteButton').props.text).toEqual('Done');
    getByTestId('EditNoteButton').props.onPress();
    expect(getByTestId('EditNoteButton').props.text).toEqual(
      'EDIT PRIVATE NOTES',
    );

    snapshot();
  });
});
