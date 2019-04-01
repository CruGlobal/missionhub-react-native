import 'react-native';
import React from 'react';

import PersonSelectStepScreen from '../PersonSelectStepScreen';
import {
  createMockNavState,
  createThunkStore,
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

const navProps = {
  contactName: 'Ron',
  contactId: contactId,
  contactStage: { id: 2 },
  contact: { id: contactId },
  createStepTracking: {},
  organization,
  next: jest.fn(),
};

const store = createThunkStore(mockState);

jest.mock('react-native-device-info');
jest.mock('../../selectors/people');

it('renders correctly', () => {
  testSnapshotShallow(
    <PersonSelectStepScreen navigation={createMockNavState(navProps)} />,
    store,
  );
});

it('allows for undefined organization', () => {
  renderShallow(
    <PersonSelectStepScreen
      navigation={createMockNavState({
        ...navProps,
        organization: undefined,
      })}
    />,
    store,
  );
});
