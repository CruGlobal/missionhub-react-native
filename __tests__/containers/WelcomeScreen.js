import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
// Note: test renderer must be required after react-native.

import WelcomeScreen from '../../src/containers/WelcomeScreen';
import { testSnapshot, createMockStore } from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import * as common from '../../src/utils/common';

const store = createMockStore({ auth: { isLoggedIn: true } });

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <WelcomeScreen />
    </Provider>
  );
});

describe('welcome screen methods', () => {
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <WelcomeScreen dispatch={() => { }} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('navigates', () => {
    navigation.navigatePush = jest.fn();
    common.disableBack = { add: jest.fn(), remove: jest.fn() };

    component.navigateToNext();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('unmounts', () => {
    common.disableBack = { add: jest.fn(), remove: jest.fn() };
    component.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});