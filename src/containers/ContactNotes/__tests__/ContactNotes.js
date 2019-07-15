import ReactNative from 'react-native';
import React from 'react';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getPersonNote, savePersonNote } from '../../../actions/person';
import BottomButton from '../../../components/BottomButton';
import { trackState } from '../../../actions/analytics';

import { ContactNotes } from '..';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([thunk]);
let shallowScreen;

const person = { id: '141234', first_name: 'Roger' };
const myUserId = '1';
const note = { id: '988998', content: 'Roge rules' };

getPersonNote.mockReturnValue(() => Promise.resolve(note));
savePersonNote.mockReturnValue(() => {});
trackState.mockReturnValue(() => {});

jest.mock('react-native-device-info');
jest.mock('../../../actions/person');
jest.mock('../../../actions/analytics');

beforeEach(
  () =>
    (shallowScreen = shallow(
      <ContactNotes
        person={person}
        myUserId={myUserId}
        dispatch={mockStore().dispatch}
      />,
    ).dive()),
);

describe('contact notes', () => {
  it('icon and prompt are shown if no notes', () => {
    expect(shallowScreen).toMatchSnapshot();
  });
  it('icon and prompt are shown if no notes as me', () => {
    shallowScreen = shallow(
      <ContactNotes
        person={person}
        myPersonId={person.id}
        myUserId={myUserId}
        dispatch={mockStore().dispatch}
      />,
    ).dive();
    expect(shallowScreen).toMatchSnapshot();
  });

  it('notes are shown', () => {
    shallowScreen.setState({ text: 'Hello, Roge! Here are some notes.' });

    expect(shallowScreen).toMatchSnapshot();
  });

  describe('and editing is set to true', () => {
    beforeEach(() => {
      shallowScreen.setState({ editing: true });
    });

    it('button message changes to DONE', () => {
      expect(shallowScreen).toMatchSnapshot();
    });

    it('editing is set to false when button is pressed', () => {
      ReactNative.Keyboard.dismiss = jest.fn();
      jest.spyOn(shallowScreen.instance(), 'saveNote');

      shallowScreen.find(BottomButton).simulate('press');

      expect(shallowScreen.state('editing')).toBe(false);
      expect(shallowScreen.instance().saveNote).toHaveBeenCalled();
      expect(ReactNative.Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  it('editing is set to true when button is pressed', () => {
    const mockFocus = jest.fn();
    Object.defineProperty(shallowScreen.instance(), 'notesInput', {
      value: { focus: mockFocus },
    });

    shallowScreen.find(BottomButton).simulate('press');

    expect(shallowScreen.state('editing')).toBe(true);
    expect(mockFocus).toHaveBeenCalled();
  });
});

describe('UNSAFE_componentWillReceiveProps', () => {
  it('should save notes when navigating away', () => {
    jest.spyOn(shallowScreen.instance(), 'saveNote');

    shallowScreen

      .instance()
      .UNSAFE_componentWillReceiveProps({ isActiveTab: false });

    expect(shallowScreen.instance().saveNote).toHaveBeenCalled();
  });
});

describe('componentDidMount', () => {
  it('should load note', async () => {
    await shallowScreen.instance().componentDidMount();

    expect(getPersonNote).toHaveBeenCalledWith(person.id, myUserId);
    expect(shallowScreen.state()).toEqual({
      editing: false,
      noteId: note.id,
      text: note.content,
    });
  });
});
