import ReactNative from 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { ContactNotes } from '../../src/containers/ContactNotes';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { testSnapshot } from '../../testUtils';
import Button from '../../src/components/Button';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders dummy view when keyboard height is not set', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactNotes />
    </Provider>
  );
});

describe('when keyboard height is set it', () => {
  let screen;

  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    screen = shallow(
      <ContactNotes person={{ personFirstName: 'Roger' }} />,
      { context: { store: store } }
    );
    screen.setState({ keyboardHeight: 216.5 });
  });

  it('shows icon and prompt by default', () => {
    expect(screen.dive()).toMatchSnapshot();
  });

  it('shows notes', () => {
    screen.setState({ text: 'Hello, Roge! Here are some notes.' });

    expect(screen.dive()).toMatchSnapshot();
  });

  describe('editing is set to true', () => {
    beforeEach(() => {
      screen.setState({ editing: true });
    });

    it('changes button message to DONE when editing', () => {
      expect(screen.dive()).toMatchSnapshot();
    });

    it('sets editing to false when button is pressed', () => {
      ReactNative.Keyboard.dismiss = jest.fn();
      jest.spyOn(screen.instance(), 'saveNotes');

      screen.find(Button).simulate('press');

      expect(screen.state('editing')).toBe(false);
      expect(screen.instance().saveNotes).toHaveBeenCalled();
      expect(ReactNative.Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  it('sets editing to true when button is pressed', () => {
    const mockFocus = jest.fn();
    Object.defineProperty(screen.instance(), 'notesInput', { value: { focus: mockFocus } });

    screen.find(Button).simulate('press');

    expect(screen.state('editing')).toBe(true);
    expect(mockFocus).toHaveBeenCalled();
  });
});

