import 'react-native';
import React from 'react';

import PersonSelectStepScreen from '../../src/containers/PersonSelectStepScreen';
import {
  createMockNavState,
  createMockStore,
  testSnapshotShallow,
} from '../../testUtils';

const myId = '14312';
const contactId = '123';
const mockState = {
  personProfile: {},
  auth: {
    person: {
      id: myId,
    },
  },
};

let store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshotShallow(
    <PersonSelectStepScreen
      navigation={createMockNavState({
        contactName: 'Ron',
        contactId: contactId,
        contactStage: { id: 2 },
        contact: { id: contactId },
        onSaveNewSteps: jest.fn(),
        createStepTracking: {},
      })}
    />,
    store,
  );
});
