import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';

import CompletedStepDetailScreen from '..';

let step;
let challenge_suggestion;
let screen;

const mockStore = configureStore([thunk]);
let store;

beforeEach(() => {
  store = mockStore();

  step = {
    title: 'SCOTTY',
    challenge_suggestion,
    completed_at: '2018-01-03',
    receiver: {
      first_name: 'Christian',
    },
  };
  screen = renderShallow(
    <CompletedStepDetailScreen
      navigation={createMockNavState({
        step,
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
    challenge_suggestion = null;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});
