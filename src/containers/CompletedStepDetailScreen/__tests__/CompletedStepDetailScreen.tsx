import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import CompletedStepDetailScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const myId = '1';
const otherId = '2';
const challenge_suggestion = { description_markdown: 'roge rules' };
const auth = { person: { id: myId } };
const step = {
  title: 'SCOTTY',
  challenge_suggestion,
  completed_at: '2018-01-03',
  receiver: {
    id: otherId,
    first_name: 'Christian',
  },
};

describe('with challenge suggestion', () => {
  it('renders correctly', () => {
    renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { step },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['step detail', 'completed step'],
      {
        screenContext: {
          [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
        },
      },
    );
  });
});

describe('without challenge suggestion', () => {
  it('renders correctly', () => {
    renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { step: { ...step, challenge_suggestion: {} } },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['step detail', 'completed step'],
      { screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' } },
    );
  });
});
