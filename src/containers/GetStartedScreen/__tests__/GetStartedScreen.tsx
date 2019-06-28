import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

import GetStartedScreen from '..';

import {
  createMockNavState,
  testSnapshot,
  createThunkStore,
} from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';
import * as common from '../../../utils/common';

const mockState = {
  profile: {
    firstName: 'Roger',
  },
};

let store;

jest.mock('react-native-device-info');

beforeEach(() => {
  store = createThunkStore(mockState);
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <GetStartedScreen navigation={createMockNavState()} />
    </Provider>,
  );
});

describe('get started methods', () => {
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <GetStartedScreen
        navigation={createMockNavState()}
        dispatch={jest.fn()}
      />,
      { context: { store } },
    );

    component = screen
      .dive()
      .dive()
      .instance();
  });

  it('saves a step', () => {
    navigation.navigatePush = jest.fn(() => ({ type: 'navigated' }));
    component.navigateNext();
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('unmounts', () => {
    common.disableBack = { remove: jest.fn() };
    component.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});
