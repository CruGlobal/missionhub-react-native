import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import AddSomeoneScreen from '../../../src/containers/AddSomeoneScreen';
import { Provider } from 'react-redux';
import {createMockStore} from '../../../testUtils';
import {shallow} from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <AddSomeoneScreen />
    </Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('has correct value for next screen', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const described = shallow(<AddSomeoneScreen />, { context: { store: store } });

  expect(described.dive().props().nextScreen).toBe('MainTabs');
});