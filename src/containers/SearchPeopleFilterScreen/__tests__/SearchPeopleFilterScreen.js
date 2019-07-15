import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { createThunkStore } from '../../../../testUtils';
import { createMockNavState, testSnapshot } from '../../../../testUtils';

import SearchPeopleFilterScreen from '..';

const mockStore = {
  organizations: { all: [] },
  groups: { all: [] },
  surveys: { all: [] },
  labels: { all: [] },
};

const store = createThunkStore(mockStore);

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
