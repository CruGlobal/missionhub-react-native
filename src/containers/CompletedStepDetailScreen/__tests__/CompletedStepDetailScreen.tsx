import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import CompletedStepDetailScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const stepId = '10';

describe('with challenge suggestion', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      navParams: { stepId },
    });

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith([
      'step detail',
      'completed step',
    ]);
  });
});

describe('without challenge suggestion', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      navParams: { stepId },
      mocks: {
        Step: () => ({ stepSuggestion: null }),
      },
    });

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith([
      'step detail',
      'completed step',
    ]);
  });
});
