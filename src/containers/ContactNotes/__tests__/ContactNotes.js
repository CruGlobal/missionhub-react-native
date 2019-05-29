import ReactNative from 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { getPersonNote, savePersonNote } from '../../../actions/person';
import { trackState } from '../../../actions/analytics';
import { buildTrackingObj } from '../../../utils/common';

import ContactNotes from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/person');
jest.mock('../../../actions/analytics');

const mockStore = configureStore([thunk]);

const myId = '111';
const otherId = '222';
const orgId = '101';
const note = { id: '988998', content: 'Hello, Roge! Here are some notes.' };
const myPerson = { id: myId };
const otherPerson = { id: otherId, first_name: 'Roger' };
const otherPersonWithNotes = {
  ...otherPerson,
  person_note: note,
};

const getNoteResponse = { type: 'get person note' };
const saveNoteRepsonse = { type: 'save person note' };
const trackStateResponse = { type: 'track state' };

let person;
let screen;
let store;

const createScreen = () => {
  store = mockStore({
    auth: { person: { id: myId } },
    people: {
      allByOrg: {
        [orgId]: {
          id: orgId,
          people: { [person.id]: person },
        },
      },
    },
  });

  screen = renderShallow(
    <ContactNotes
      isActiveTab={true}
      person={person}
      organization={{ id: orgId }}
    />,
    store,
  );
};

beforeEach(() => {
  getPersonNote.mockReturnValue(getNoteResponse);
  savePersonNote.mockReturnValue(saveNoteRepsonse);
  trackState.mockReturnValue(trackStateResponse);
});

describe('contact notes', () => {
  describe('render', () => {
    it('icon and prompt are shown if no notes', () => {
      person = otherPerson;

      createScreen();

      expect(screen).toMatchSnapshot();
    });

    it('icon and prompt are shown if no notes as me', () => {
      person = myPerson;

      createScreen();

      expect(screen).toMatchSnapshot();
    });

    it('notes are shown', () => {
      person = otherPersonWithNotes;

      createScreen();

      expect(screen).toMatchSnapshot();
    });

    it('with notes in edit mode', () => {
      person = otherPersonWithNotes;

      createScreen();

      screen.setState({ editing: true });

      expect(screen).toMatchSnapshot();
    });
  });

  describe('press button', () => {
    describe('starts out of edit mode', () => {
      const mockFocus = jest.fn();
      beforeEach(() => {
        person = otherPerson;

        createScreen();

        Object.defineProperty(screen.instance(), 'notesInput', {
          value: { focus: mockFocus },
        });

        screen
          .childAt(1)
          .props()
          .onPress();
      });

      it('editing is set to true, notes focused, and tracks state', () => {
        expect(screen.instance().state.editing).toEqual(true);
        expect(mockFocus).toHaveBeenCalled();
        expect(trackState).toHaveBeenCalledWith(
          buildTrackingObj(
            'people : person : notes : edit',
            'people',
            'person',
            'notes',
            'edit',
          ),
        );
        expect(store.getActions()).toEqual([
          getNoteResponse,
          trackStateResponse,
        ]);
      });
    });

    describe('starts in edit mode', () => {
      beforeEach(() => {
        ReactNative.Keyboard.dismiss = jest.fn();

        person = otherPersonWithNotes;

        createScreen();

        screen.setState({ editing: true });

        screen
          .childAt(1)
          .props()
          .onPress();
      });

      it('editing is set to false, closes keyboard, and saves note', () => {
        expect(screen.instance().state.editing).toEqual(false);
        expect(ReactNative.Keyboard.dismiss).toHaveBeenCalled();
        expect(savePersonNote).toHaveBeenCalledWith(
          otherId,
          note.content,
          note.id,
        );
        expect(store.getActions()).toEqual([getNoteResponse, saveNoteRepsonse]);
      });
    });
  });

  describe('UNSAFE_componentWillReceiveProps', () => {
    it('should save notes when navigating away', () => {
      ReactNative.Keyboard.dismiss = jest.fn();
      person = otherPersonWithNotes;

      createScreen();

      screen.setState({ editing: true });

      screen
        .instance()
        .UNSAFE_componentWillReceiveProps({ isActiveTab: false });

      expect(screen.instance().state.editing).toEqual(false);
      expect(ReactNative.Keyboard.dismiss).toHaveBeenCalled();
      expect(savePersonNote).toHaveBeenCalledWith(
        otherId,
        note.content,
        note.id,
      );
      expect(store.getActions()).toEqual([getNoteResponse, saveNoteRepsonse]);
    });

    it('should store note from Redux in state if state has no text', () => {
      ReactNative.Keyboard.dismiss = jest.fn();
      person = otherPerson;

      createScreen();

      screen
        .instance()
        .UNSAFE_componentWillReceiveProps({ person: otherPersonWithNotes });

      expect(screen.instance().state.text).toEqual(note.content);
      expect(screen.instance().state.noteId).toEqual(note.id);
    });

    it('should not store note from Redux in state if state has text', () => {
      ReactNative.Keyboard.dismiss = jest.fn();
      person = otherPersonWithNotes;

      const newNote = { id: '777', content: 'new note' };

      createScreen();

      screen.instance().UNSAFE_componentWillReceiveProps({
        person: { ...otherPerson, person_note: newNote },
      });

      expect(screen.instance().state.text).toEqual(note.content);
      expect(screen.instance().state.noteId).toEqual(note.id);
    });
  });

  describe('componentDidMount', () => {
    beforeEach(() => {
      person = otherPerson;

      createScreen();
    });

    it('should load note', () => {
      expect(getPersonNote).toHaveBeenCalledWith(otherId);
      expect(store.getActions()).toEqual([getNoteResponse]);
    });
  });
});
