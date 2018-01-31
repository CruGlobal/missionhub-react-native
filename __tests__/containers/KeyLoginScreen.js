import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import KeyLoginScreen from '../../src/containers/KeyLoginScreen';
import Adapter from 'enzyme-adapter-react-16/build/index';
import Enzyme, { shallow } from 'enzyme/build/index';
import { createMockStore, testSnapshot } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';

let store;

jest.mock('react-native-device-info');
jest.mock('../../src/actions/auth');
jest.mock('../../src/actions/navigation');

beforeEach(() => {
  store = createMockStore();
  Enzyme.configure({ adapter: new Adapter() });
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <KeyLoginScreen />
    </Provider>
  );
});

describe('when login button is clicked', () => {
  let screen;
  const loginResult = { type: 'key login' };

  const click = () => screen.dive().dive().dive().find('Button').simulate('press');

  beforeEach(() => {
    screen = shallow(
      <KeyLoginScreen />,
      { context: { store: store } }
    );

    auth.keyLogin = jest.fn().mockReturnValue(loginResult);
  });

  it('key login is called', async() => {
    await click();

    expect(store.dispatch).toHaveBeenLastCalledWith(loginResult);
  });
});

