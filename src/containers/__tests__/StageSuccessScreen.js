import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import StageSuccessScreen from '../StageSuccessScreen';
import {
  testSnapshot,
  createMockNavState,
  createThunkStore,
} from '../../../testUtils';

const mockState = {
  profile: {},
  selectedStage: {},
};

const store = createThunkStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StageSuccessScreen
        navigation={createMockNavState({
          selectedStage: {
            self_followup_description: '<<user>> test',
          },
        })}
      />
    </Provider>,
  );
});

it('renders correctly with default state', () => {
  testSnapshot(
    <Provider store={store}>
      <StageSuccessScreen navigation={createMockNavState()} />
    </Provider>,
  );
});
