import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import IconMessageScreen from '../../../src/containers/IconMessageScreen/index';
import { Provider } from 'react-redux';

import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const mockNavigatePush = () => {
  return 'next';
};

const store = {
  getState: jest.fn(() => ({
    profile: {},
    stages: {},
  })),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};

jest.mock('react-native-device-info');
jest.mock('../../../src/actions/navigation', () => {
  return {
    navigatePush: () => mockNavigatePush(),
  };
});

const renderAndTest = (mainText, buttonText, iconPath) => {
  const tree = renderer.create(
    <Provider store={store}>
      <IconMessageScreen mainText={mainText} buttonText={buttonText} iconPath={iconPath} />
    </Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
};

it('renders main text correctly', () => {
  renderAndTest('Hello, world!');
});

it('renders button text correctly', () => {
  renderAndTest(null, 'Click me');
});

it('renders icon correctly', () => {
  renderAndTest(null, null, require('../../../assets/images/footprints.png'));
});

it('goes to the next screen', () => {
  Enzyme.configure({ adapter: new Adapter() });

  const wrapper = shallow(
    <IconMessageScreen />,
    { context: { store: store } },
  );

  const button = wrapper.dive().childAt(2).childAt(0);
  button.simulate('press');

  expect(store.dispatch).toHaveBeenCalledWith(mockNavigatePush());
});