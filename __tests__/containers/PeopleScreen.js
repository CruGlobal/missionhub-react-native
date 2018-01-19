import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import PeopleScreen from '../../src/containers/PeopleScreen';
import { testSnapshot } from '../../testUtils';

jest.mock('../../src/actions/people', () => ({
  getPeopleWithOrgSections: () => { },
}));

const mockState = {
  auth: {
    personId: '',
    user: {
      id: '1',
    },
  },
  people: {
    all: [],
    allByOrg: [],
  },
  stages: {
    stagesObj: {},
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleScreen />
    </Provider>
  );
});