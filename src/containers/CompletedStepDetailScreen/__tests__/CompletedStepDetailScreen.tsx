import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  renderWithContext,
  createMockNavState,
  renderShallow,
} from '../../../../testUtils';

import CompletedStepDetailScreen from '..';

const mockStore = configureStore([thunk]);
let store;

const challenge_suggestion = { description_markdown: 'roge rules' };
const step = {
  title: 'SCOTTY',
  challenge_suggestion,
  completed_at: '2018-01-03',
  receiver: {
    first_name: 'Christian',
  },
};

describe('with challenge suggestion', () => {
  it('renders correctly', () => {
    renderWithContext(<CompletedStepDetailScreen />, {
      navParams: { step },
    }).snapshot();
  });
});

describe('without challenge suggestion', () => {
  it('renders correctly', () => {
    renderWithContext(<CompletedStepDetailScreen />, {
      navParams: { step: { ...step, challenge_suggestion: {} } },
    }).snapshot();
  });
});
