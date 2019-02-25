import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';

import CompletedStepDetailScreen from '..';

const step = { title: 'SCOTTY' };
let screen;

const mockStore = configureStore([thunk]);
let store;

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <CompletedStepDetailScreen navigation={createMockNavState({ step })} />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});
