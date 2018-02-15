import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import SelectMyStepScreen from '../../src/containers/SelectMyStepScreen';
import { testSnapshot, createMockNavState, createMockStore } from '../../testUtils';

jest.mock('react-native-device-info');

const store = createMockStore({
  steps: {
    suggestedForMe: [ { id: '1', body: 'test' }, { id: '2', body: 'test' }, { id: '3', body: 'test' } ],
  },
  auth: {
    personId: 1234,
  },
});


it('renders correctly with button', () => {
  testSnapshot(
    <Provider store={store}>
      <SelectMyStepScreen
        navigation={createMockNavState({
          onSaveNewSteps: jest.fn(),
          enableBackButton: true,
        })}
      />
    </Provider>
  );
});

it('renders correctly without button', () => {
  testSnapshot(
    <Provider store={store}>
      <SelectMyStepScreen
        navigation={createMockNavState({
          onSaveNewSteps: jest.fn(),
          enableBackButton: false,
        })}
      />
    </Provider>
  );
});
