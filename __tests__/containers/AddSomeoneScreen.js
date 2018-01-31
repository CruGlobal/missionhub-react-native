import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import AddSomeoneScreen from '../../src/containers/AddSomeoneScreen';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { testSnapshotShallow } from '../../testUtils';

const mockState = {
  notifications: { hasAsked: true },
};
const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshotShallow(
    <Provider store={store}>
      <AddSomeoneScreen />
    </Provider>
  );
});

it('has correct value for next screen', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const described = shallow(<AddSomeoneScreen />, { context: { store: store } });

  expect(described.dive().props().nextScreen).toBe('SetupPerson');
});
