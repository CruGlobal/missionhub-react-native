import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { createMockStore } from '../../testUtils/index';
import SearchPeopleFilterScreen from '../../src/containers/SearchPeopleFilterScreen';
import { createMockNavState, testSnapshot } from '../../testUtils';

const mockStore = {
  organizations: { all: [] },
  groups: { all: [] },
  surveys: { all: [] },
  labels: { all: [] },
};

const store = createMockStore(mockStore);

jest.mock('react-native-device-info');
jest.mock('Switch');

const mockFilters = {
  ministry: { id: 'test1', text: 'Test 1' },
  unassigned: { id: 'test2', text: 'Test 2' },
  archived: { id: 'test3', text: 'Test 3' },
};

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SearchPeopleFilterScreen
        navigation={createMockNavState({
          onFilter: jest.fn(),
          filters: mockFilters,
        })}
      />
    </Provider>,
  );
});
