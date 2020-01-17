import ReactNative from 'react-native';
import React from 'react';
// @ts-ignore
import { shallow } from 'enzyme/build/index';
// @ts-ignore
import Enzyme from 'enzyme/build/index';
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16/build/index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getPersonNote, savePersonNote } from '../../../actions/person';
import BottomButton from '../../../components/BottomButton';

import { ContactNotes } from '..';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([thunk]);
// @ts-ignore
let shallowScreen;

const person = { id: '141234', first_name: 'Roger' };
const myUserId = '1';
const note = { id: '988998', content: 'Roge rules' };

// @ts-ignore
getPersonNote.mockReturnValue(() => Promise.resolve(note));
// @ts-ignore
savePersonNote.mockReturnValue(() => {});

jest.mock('react-native-device-info');
jest.mock('../../../actions/person');

beforeEach(
  () =>
    (shallowScreen = shallow(
      <ContactNotes
        // @ts-ignore
        person={person}
        myUserId={myUserId}
        dispatch={mockStore().dispatch}
      />,
    ).dive()),
);

describe('contact notes', () => {
  it('icon and prompt are shown if no notes', () => {
    // @ts-ignore
    expect(shallowScreen).toMatchSnapshot();
  });
  it('icon and prompt are shown if no notes as me', () => {
    shallowScreen = shallow(
      <ContactNotes
        // @ts-ignore
        person={person}
        myPersonId={person.id}
        myUserId={myUserId}
        dispatch={mockStore().dispatch}
      />,
    ).dive();
    expect(shallowScreen).toMatchSnapshot();
  });

  it('notes are shown', () => {
    // @ts-ignore
    shallowScreen.setState({ text: 'Hello, Roge! Here are some notes.' });

    // @ts-ignore
    expect(shallowScreen).toMatchSnapshot();
  });

  describe('and editing is set to true', () => {
    beforeEach(() => {
      // @ts-ignore
      shallowScreen.setState({ editing: true });
    });

    it('button message changes to DONE', () => {
      // @ts-ignore
      expect(shallowScreen).toMatchSnapshot();
    });

    it('editing is set to false when button is pressed', () => {
      ReactNative.Keyboard.dismiss = jest.fn();
      // @ts-ignore
      jest.spyOn(shallowScreen.instance(), 'saveNote');

      // @ts-ignore
      shallowScreen.find(BottomButton).simulate('press');

      // @ts-ignore
      expect(shallowScreen.state('editing')).toBe(false);
      // @ts-ignore
      expect(shallowScreen.instance().saveNote).toHaveBeenCalled();
      expect(ReactNative.Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  it('editing is set to true when button is pressed', () => {
    const mockFocus = jest.fn();
    // @ts-ignore
    Object.defineProperty(shallowScreen.instance(), 'notesInput', {
      value: { focus: mockFocus },
    });

    // @ts-ignore
    shallowScreen.find(BottomButton).simulate('press');

    // @ts-ignore
    expect(shallowScreen.state('editing')).toBe(true);
    expect(mockFocus).toHaveBeenCalled();
  });
});

describe('UNSAFE_componentWillReceiveProps', () => {
  it('should save notes when navigating away', () => {
    // @ts-ignore
    jest.spyOn(shallowScreen.instance(), 'saveNote');

    // @ts-ignore
    shallowScreen

      .instance()
      .UNSAFE_componentWillReceiveProps({ isActiveTab: false });

    // @ts-ignore
    expect(shallowScreen.instance().saveNote).toHaveBeenCalled();
  });
});

describe('componentDidMount', () => {
  it('should load note', async () => {
    // @ts-ignore
    await shallowScreen.instance().componentDidMount();

    expect(getPersonNote).toHaveBeenCalledWith(person.id, myUserId);
    // @ts-ignore
    expect(shallowScreen.state()).toEqual({
      editing: false,
      noteId: note.id,
      text: note.content,
    });
  });
});
