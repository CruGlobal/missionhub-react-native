import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import PersonSelectStepScreen from '../../src/containers/PersonSelectStepScreen';
import { testSnapshot, createMockNavState, createMockStore } from '../../testUtils';

const mockState = {
  steps: {
    suggestedForOthers: [
      { id: 1, body: '<<name>> 1' },
      { id: 2, body: '<<name>> 2' },
      { id: 3, body: '<<name>> 3' },
    ],
  },
  personProfile: {
    personFirstName: 'Bill',
    id: 1234,
  },
};

let store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PersonSelectStepScreen
        navigation={createMockNavState({
          contactName: 'Ron',
          contactId: '123',
          contact: {},
          onSaveNewSteps: jest.fn(),
          enableButton: true,
        })}
      />
    </Provider>
  );
});
