import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import CompletedStepDetailScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');

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

    expect(useAnalytics).toHaveBeenCalledWith({
      screenName: ['step detail', 'completed step'],
    });
  });
});

describe('without challenge suggestion', () => {
  it('renders correctly', () => {
    renderWithContext(<CompletedStepDetailScreen />, {
      navParams: { step: { ...step, challenge_suggestion: {} } },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith({
      screenName: ['step detail', 'completed step'],
    });
  });
});
