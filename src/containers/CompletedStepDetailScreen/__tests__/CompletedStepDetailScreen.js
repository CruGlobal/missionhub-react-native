import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';

import CompletedStepDetailScreen from '..';

let challenge_suggestion;
let screen;

const mockStore = configureStore([thunk]);
let store;

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <CompletedStepDetailScreen
      navigation={createMockNavState({
        step: {
          title: 'SCOTTY',
          challenge_suggestion,
        },
      })}
    />,
    store,
  );
});

describe('with challenge suggestion', () => {
  beforeAll(() => {
    challenge_suggestion = { description_markdown: 'roge rules' };
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('without challenge suggestion', () => {
  beforeAll(() => {
    challenge_suggestion = undefined;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});
