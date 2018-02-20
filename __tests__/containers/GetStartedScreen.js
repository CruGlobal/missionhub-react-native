import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
// Note: test renderer must be required after react-native.

import GetStartedScreen from '../../src/containers/GetStartedScreen';
import { createMockNavState, testSnapshot, createMockStore } from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import * as common from '../../src/utils/common';

const mockState = {
  profile: {
    firstName: 'Roger',
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <GetStartedScreen navigation={createMockNavState()} />
    </Provider>
  );
});

describe('get started methods', () => {
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <GetStartedScreen navigation={createMockNavState()} dispatch={() => {}} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('saves a step', () => {
    navigation.navigatePush = jest.fn();
    component.navigateNext();
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('unmounts', () => {
    common.disableBack = { remove: jest.fn() };
    component.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});