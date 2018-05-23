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
let personStageId;
const mockState = {
  steps: {
    suggestedForOthers: {
      1: [{ id: '1', body: '<<name>> test step 1' }],
      2: [{ id: '2', body: '<<name>> test step 2' }],
      3: [{ id: '3', body: '<<name>> test step 3' }],
    },
  },
  personProfile: {},
  auth: {
    person: {
      id: myId,
    },
  },
};

let store = createMockStore(mockState);

jest.mock('react-native-device-info');

const test = () => {
  testSnapshotShallow(
    <PersonSelectStepScreen
      navigation={createMockNavState({
        contactName: 'Ron',
        contactId: contactId,
        contactStage: { id: personStageId },
        contact: { id: contactId },
        onSaveNewSteps: jest.fn(),
        createStepTracking: {},
      })}
    />,
    store,
  );
};

it('renders steps if person has stage set', () => {
  personStageId = 2;

  test();
});

it('sends empty array of steps if person does not have stage set', () => {
  personStageId = null;

  test();
});
