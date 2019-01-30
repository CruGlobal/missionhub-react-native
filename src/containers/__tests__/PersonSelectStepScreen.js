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
const mockSaveSteps = jest.fn();
const mockNext = jest.fn();

const navProps = {
  contactName: 'Ron',
  contactId: contactId,
  contactStage: { id: 2 },
  contact: { id: contactId },
  onSaveNewSteps: mockSaveSteps,
  createStepTracking: {},
  organization,
};

const store = createMockStore(mockState);

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

describe('handleNavigate', () => {
  let screen;

  it('runs onSaveNewSteps', () => {
    screen = renderShallow(
      <PersonSelectStepScreen navigation={createMockNavState(navProps)} />,
      store,
    );

    screen.props().onComplete();

    expect(mockSaveSteps).toHaveBeenCalledTimes(1);
  });

  it('runs next', () => {
    screen = renderShallow(
      <PersonSelectStepScreen
        navigation={createMockNavState({
          ...navProps,
          onSaveNewSteps: undefined,
          next: mockNext,
        })}
      />,
      store,
    );

    screen.props().onComplete();

    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
