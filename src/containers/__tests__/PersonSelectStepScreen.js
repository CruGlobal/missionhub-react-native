import 'react-native';
import React from 'react';

import PersonSelectStepScreen from '../PersonSelectStepScreen';
import {
  createMockNavState,
  createMockStore,
  testSnapshotShallow,
  renderShallow,
} from '../../../testUtils';

const myId = '14312';
const contactId = '123';
const organization = { id: '889' };
const mockState = {
  personProfile: {},
  auth: {
    person: {
      id: myId,
    },
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');
jest.mock('../../selectors/people');

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
        organization,
      })}
    />,
    store,
  );
});

it('allows for undefined organization', () => {
  renderShallow(
    <PersonSelectStepScreen
      navigation={createMockNavState({
        contactName: 'Ron',
        contactId: contactId,
        contactStage: { id: 2 },
        contact: { id: contactId },
        onSaveNewSteps: jest.fn(),
        createStepTracking: {},
        organization: undefined,
      })}
    />,
    store,
  );
});
