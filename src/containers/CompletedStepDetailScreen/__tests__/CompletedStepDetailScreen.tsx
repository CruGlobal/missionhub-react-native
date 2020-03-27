import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import CompletedStepDetailScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const myId = '1';
const auth = { person: { id: myId } };
const stepId = '5';

describe('with challenge suggestion', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId },
    });

    await flushMicrotasksQueue();
    snapshot();

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
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId },
    });

    await flushMicrotasksQueue();
    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['step detail', 'completed step'],
      { screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' } },
    );
  });
});
