import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import { createMockStore, createMockNavState, testSnapshot } from '../../testUtils';
import CelebrationScreen from '../../src/containers/CelebrationScreen';
import * as navigation from '../../src/actions/navigation';
import * as common from '../../src/utils/common';

const store = createMockStore();

jest.mock('react-native-device-info');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <CelebrationScreen navigation={createMockNavState()} />
    </Provider>
  );
});


describe('celebration screen methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <CelebrationScreen navigation={createMockNavState({
        onComplete: mockComplete,
      })} />,
      { context: { store } },
    );

    component = screen.dive().instance();
  });

  it('runs onComplete', () => {
    component.navigateToNext();
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});

describe('celebration screen methods without onComplete', () => {
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <CelebrationScreen navigation={createMockNavState()} />,
      { context: { store } },
    );

    component = screen.dive().instance();
  });

  it('does a reset', () => {
    navigation.navigateReset = jest.fn();
    component.navigateToNext();
    expect(navigation.navigateReset).toHaveBeenCalledTimes(1);
  });

  it('unmounts', () => {
    common.disableBack = { remove: jest.fn() };
    component.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});
