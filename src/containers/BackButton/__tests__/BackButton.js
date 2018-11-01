import React from 'react';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';

import { BackButton } from '..';

import { createMockStore } from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';
import IconButton from '../../../components/IconButton';

const store = createMockStore();
let shallowScreen;

jest.mock('react-native-device-info');

describe('back button', () => {
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    shallowScreen = shallow(<BackButton dispatch={jest.fn()} />, {
      context: { store: store },
    });

    shallowScreen = shallowScreen.dive();
  });

  it('renders normally', () => {
    expect(shallowScreen.dive()).toMatchSnapshot();
  });

  it('calls navigate back once', () => {
    navigation.navigateBack = jest.fn();
    shallowScreen
      .find(IconButton)
      .props()
      .onPress();

    expect(navigation.navigateBack).toHaveBeenCalledTimes(1);
  });
});

describe('back button absolute', () => {
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    shallowScreen = shallow(
      <BackButton absolute={true} dispatch={jest.fn()} />,
      { context: { store: store } },
    );

    shallowScreen = shallowScreen.dive();
  });

  it('renders with absolute', () => {
    expect(shallowScreen.dive()).toMatchSnapshot();
  });
});

describe('back button customNavigate', () => {
  const mockCustomNav = jest.fn();

  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    shallowScreen = shallow(
      <BackButton customNavigate={mockCustomNav} dispatch={jest.fn()} />,
      { context: { store: store } },
    );

    shallowScreen = shallowScreen.dive();
  });

  it('custom navigation function is called', () => {
    navigation.navigateBack = jest.fn();
    shallowScreen
      .find(IconButton)
      .props()
      .onPress();

    expect(mockCustomNav).toHaveBeenCalledTimes(1);
  });
});
