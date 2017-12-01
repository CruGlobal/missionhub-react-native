import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import AddStepScreen from '../../src/containers/AddStepScreen/index';
import { Provider } from 'react-redux';
import {createMockStore} from '../../testUtils/index';
import {createMockNavState, testSnapshot} from '../../testUtils';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen navigation={createMockNavState()} />
    </Provider>
  );
});