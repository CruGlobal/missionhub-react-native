import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import SetupPersonScreen from '../../src/containers/SetupPersonScreen';
import { createMockStore, createMockNavState, testSnapshotShallow } from '../../testUtils';

const mockState = {
  personProfile: {
    personFirstName: '',
    personLastName: '',
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly when creating a new person', () => {
  testSnapshotShallow(
    <SetupPersonScreen navigation={createMockNavState()} />,
    store
  );
});

it('renders correctly when editing a person', () => {
  testSnapshotShallow(
    <SetupPersonScreen navigation={createMockNavState({
      person: {
        id: 1,
        first_name: 'Fname',
        last_name: 'Lname',
      },
    })} />,
    store
  );
});
