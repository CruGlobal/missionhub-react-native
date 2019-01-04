import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import TakeAStepWithSomeoneButton from '../index';
import { testSnapshotShallow } from '../../../../testUtils';

const mockStore = configureStore([thunk]);

it('renders correctly for someone who has created a step', () => {
  testSnapshotShallow(
    <TakeAStepWithSomeoneButton />,
    mockStore({ personProfile: { hasNotCreatedStep: false } }),
  );
});

it('renders correctly for someone who has not created a step', () => {
  testSnapshotShallow(
    <TakeAStepWithSomeoneButton />,
    mockStore({ personProfile: { hasNotCreatedStep: true } }),
  );
});
