import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import PersonSelectStepScreen from '../../src/containers/PersonSelectStepScreen';
import { createMockNavState, createMockStore, testSnapshotShallow } from '../../testUtils';

const myId = 14312;
let personStageId;
const mockState = {
  steps: {
    suggestedForOthers: {
      1: [ { id: '1', body: '<<name>> test step 1' } ],
      2: [ { id: '2', body: '<<name>> test step 2' } ],
      3: [ { id: '3', body: '<<name>> test step 3' } ],
    },
  },
  personProfile: {},
  auth: { personId: myId },
};

let store = createMockStore(mockState);

jest.mock('react-native-device-info');

const test = () => {
  testSnapshotShallow(
    <PersonSelectStepScreen
      navigation={createMockNavState({
        contactName: 'Ron',
        contactId: '123',
        contact: {
          reverse_contact_assignments: [ { assigned_to: { id: myId }, pathway_stage_id: personStageId } ],
        },
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
