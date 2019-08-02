import 'react-native';
import React from 'react';

import StageSuccessScreen from '../StageSuccessScreen';
import { renderWithContext } from '../../../testUtils';

const mockState = {
  profile: {},
  selectedStage: {},
};

jest.mock('react-native-device-info');

it('renders correctly', () => {
  renderWithContext(<StageSuccessScreen />, {
    initialState: mockState,
    navParams: {
      selectedStage: {
        self_followup_description: '<<user>> test',
      },
    },
  }).snapshot();
});

it('renders correctly with default state', () => {
  renderWithContext(<StageSuccessScreen />, {
    initialState: mockState,
  }).snapshot();
});
