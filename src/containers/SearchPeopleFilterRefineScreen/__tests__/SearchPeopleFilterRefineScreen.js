import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { createThunkStore } from '../../../../testUtils';

import SearchPeopleFilterRefineScreen from '..';

import { createMockNavState, testSnapshot } from '../../../../testUtils';

const store = createThunkStore();

jest.mock('react-native-device-info');
jest.mock('Switch');

const options = [
  {
    id: 'test1',
    text: 'Test 1',
    options: [],
  },
  {
    id: 'test10',
    text: 'Test 10',
    options: [{ id: 'test2', text: 'Test 2' }, { id: 'test3', text: 'Test 3' }],
  },
];

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SearchPeopleFilterRefineScreen
        navigation={createMockNavState({
          onFilter: jest.fn(),
          options,
        })}
      />
    </Provider>,
  );
});

it('renders title correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SearchPeopleFilterRefineScreen
        navigation={createMockNavState({
          onFilter: jest.fn(),
          options: options,
          title: 'Test',
        })}
      />
    </Provider>,
  );
});
