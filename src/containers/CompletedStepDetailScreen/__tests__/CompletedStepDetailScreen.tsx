import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { STEP_DETAIL_POST_FRAGMENT } from '../../../components/StepDetailScreen/queries';

import CompletedStepDetailScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const myId = '1';
const auth = { person: { id: myId } };
const stepId = '5';
const mockPost = mockFragment(STEP_DETAIL_POST_FRAGMENT);

it('renders loading state correctly', () => {
  const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
    initialState: { auth },
    navParams: { stepId },
    mocks: {
      Step: () => ({
        post: () => null,
      }),
    },
  });

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'completed step'], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
    },
  });
});

describe('with challenge suggestion', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId },
      mocks: {
        Step: () => ({
          post: () => null,
        }),
      },
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
      mocks: {
        Step: () => ({
          post: () => null,
        }),
      },
    });

    await flushMicrotasksQueue();
    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['step detail', 'completed step'],
      { screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' } },
    );
  });
});

describe('post', () => {
  it('renders without post', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId },
      mocks: {
        Step: () => ({
          post: () => null,
        }),
      },
    });

    await flushMicrotasksQueue();
    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['step detail', 'completed step'],
      { screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' } },
    );
  });

  it('renders with post', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId },
      mocks: {
        Step: () => ({
          post: () => mockPost,
        }),
      },
    });

    await flushMicrotasksQueue();
    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['step detail', 'completed step'],
      { screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' } },
    );
  });
});
