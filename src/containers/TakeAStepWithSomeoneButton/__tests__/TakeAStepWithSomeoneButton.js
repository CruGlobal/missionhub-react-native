import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import TakeAStepWithSomeoneButton from '../index';
import { testSnapshotShallow } from '../../../../testUtils';

const mockStore = configureStore([thunk]);

it('renders correctly', () => {
  testSnapshotShallow(
    <TakeAStepWithSomeoneButton />,
    mockStore({ personProfile: { hasNotCreatedStep: false } }),
  );
});
