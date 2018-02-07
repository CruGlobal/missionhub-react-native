import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import SelectMyStepScreen from '../../src/containers/SelectMyStepScreen';
import { testSnapshot, createMockNavState, createMockStore } from '../../testUtils';

jest.mock('react-native-device-info');

const store = createMockStore({
  steps: {
    suggestedForMe: [ { id: 1 }, { id: 2 }, { id: 3 } ],
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
          enableButton: true,
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
          enableButton: false,
        })}
      />
    </Provider>
  );
});
