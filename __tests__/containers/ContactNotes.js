import ReactNative from 'react-native';
import React from 'react';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';

import { createMockStore } from '../../testUtils/index';
import { ContactNotes } from '../../src/containers/ContactNotes';
import Button from '../../src/components/Button';

const store = createMockStore();
let shallowScreen;

jest.mock('react-native-device-info');

beforeEach(() => {
  Enzyme.configure({ adapter: new Adapter() });
  shallowScreen = shallow(
    <ContactNotes person={{ first_name: 'Roger' }} dispatch={jest.fn()} />,
    { context: { store: store } },
  );

  shallowScreen = shallowScreen.dive().dive();
});

describe('contact notes', () => {
  it('icon and prompt are shown if no notes', () => {
    expect(shallowScreen.dive()).toMatchSnapshot();
  });

  it('notes are shown', () => {
    shallowScreen.setState({ text: 'Hello, Roge! Here are some notes.' });

    expect(shallowScreen.dive()).toMatchSnapshot();
  });

  describe('and editing is set to true', () => {
    beforeEach(() => {
      shallowScreen.setState({ editing: true });
    });

    it('button message changes to DONE', () => {
      expect(shallowScreen.dive()).toMatchSnapshot();
    });

    it('editing is set to false when button is pressed', () => {
      ReactNative.Keyboard.dismiss = jest.fn();
      jest.spyOn(shallowScreen.instance(), 'saveNote');

      shallowScreen.find(Button).simulate('press');

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

    shallowScreen.find(Button).simulate('press');

    expect(shallowScreen.state('editing')).toBe(true);
    expect(mockFocus).toHaveBeenCalled();
  });
});

describe('componentWillReceiveProps', () => {
  it('should save notes when navigating away', () => {
    jest.spyOn(shallowScreen.instance(), 'saveNote');

    shallowScreen.instance().componentWillReceiveProps({ isActiveTab: false });

    expect(shallowScreen.instance().saveNote).toHaveBeenCalled();
  });
});
