import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import {createMockStore} from '../../testUtils/index';
import PersonStageScreen from '../../src/containers/PersonStageScreen';
import {testSnapshot} from '../../testUtils';

const mockState = {
  personProfile: {
    personFirstName: 'Billy',
    personLastName: 'Test',
  },
  stages: [],
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PersonStageScreen />
    </Provider>
  );
});