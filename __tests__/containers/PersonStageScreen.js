import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import PersonStageScreen from '../../src/containers/PersonStageScreen';
import { testSnapshot, createMockNavState, createMockStore } from '../../testUtils';

const mockState = {
  personProfile: {
    personFirstName: 'Billy',
    personLastName: 'Test',
  },
  auth: {},
  notifications: {},
  stages: [],
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PersonStageScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
        })}
      />
    </Provider>
  );
});
