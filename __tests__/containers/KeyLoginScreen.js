import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import KeyLoginScreen from '../../src/containers/KeyLoginScreen';
import Adapter from 'enzyme-adapter-react-16/build/index';
import Enzyme, { shallow } from 'enzyme/build/index';
import { createMockStore, testSnapshot } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';
import * as navigation from '../../src/actions/navigation';

let store;
let screen;

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
  const mockNavResult = 'test';
  let user;

  beforeEach(() => {
    user =  { pathway_stage_id: null };

    navigation.navigatePush = jest.fn().mockReturnValue(mockNavResult);

    auth.keyLogin = jest.fn().mockReturnValue(Promise.resolve({
      findAll: () => [user],
    }));
  });

  it('user navigates to GetStarted screen if stage is not set', async() => {
    screen = shallow(
      <KeyLoginScreen />,
      { context: { store: store } }
    );

    await screen.dive().dive().dive().find('Button').simulate('press');

    expect(store.dispatch).toHaveBeenLastCalledWith(mockNavResult);
  });
});

