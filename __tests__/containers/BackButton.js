import React from 'react';
import Adapter from 'enzyme-adapter-react-16/build/index';

// Note: test renderer must be required after react-native.
import { BackButton } from '../../src/containers/BackButton';
import { createMockStore } from '../../testUtils/index';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Touchable from '../../src/components/Touchable';
import * as navigation from '../../src/actions/navigation';

const store = createMockStore();
let shallowScreen;

jest.mock('react-native-device-info');


describe('back button', () => {
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    shallowScreen = shallow(
      <BackButton dispatch={jest.fn()} />,
      { context: { store: store } }
    );
  
    shallowScreen = shallowScreen.dive();
  });
  
  it('renders normally', () => {
    expect(shallowScreen.dive()).toMatchSnapshot();
  });

  it('calls navigate back once', () => {
    navigation.navigateBack = jest.fn();
    shallowScreen.find(Touchable).simulate('press');

    expect(navigation.navigateBack).toHaveBeenCalledTimes(1);
  });
});

describe('back button absolute', () => {
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    shallowScreen = shallow(
      <BackButton absolute={true} dispatch={jest.fn()} />,
      { context: { store: store } }
    );
  
    shallowScreen = shallowScreen.dive();
  });
  
  it('renders with absolute', () => {
    expect(shallowScreen.dive()).toMatchSnapshot();
  });
});

describe('back button customNavigate', () => {
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    shallowScreen = shallow(
      <BackButton customNavigate="backToStages" dispatch={jest.fn()} />,
      { context: { store: store } }
    );
  
    shallowScreen = shallowScreen.dive();
  });


  it('navigate back is called 2 times', () => {
    navigation.navigateBack = jest.fn();
    shallowScreen.find(Touchable).simulate('press');

    expect(navigation.navigateBack).toHaveBeenCalledWith(2);
  });
});