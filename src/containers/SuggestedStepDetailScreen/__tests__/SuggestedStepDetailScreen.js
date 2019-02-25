import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';

import SuggestedStepDetailScreen from '..';

let step = { body: 'do this step' };
const receiverId = '423325';
const orgId = '880124';
let screen;

const mockStore = configureStore([thunk]);
let store;

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <SuggestedStepDetailScreen
      navigation={createMockNavState({ step, receiverId, orgId })}
    />,
    store,
  );
});

describe('without description', () => {
  beforeAll(() => {
    step = { ...step };
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('with description', () => {
  beforeAll(() => {
    step = { ...step, description_markdown: 'some markdown' };
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});
