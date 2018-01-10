import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import StageSuccessScreen from '../../src/containers/StageSuccessScreen';
import { testSnapshot, createMockNavState, createMockStore } from '../../testUtils';

const mockState = {
  profile: {},
  selectedStage: {},
};

const store = createMockStore(mockState);

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
    </Provider>
  );
});
