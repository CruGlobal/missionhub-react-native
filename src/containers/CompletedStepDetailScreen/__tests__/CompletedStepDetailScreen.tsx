import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import CompletedStepDetailScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const myId = '1';
const personId = '2';
const auth = { person: { id: myId } };
const stepId = '5';

it('renders loading state correctly', () => {
  const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
    initialState: { auth },
    navParams: { stepId, personId },
    mocks: {
      Step: () => ({
        post: () => null,
      }),
    },
  });

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'completed step'], {
    assignmentType: { personId },
  });
});

describe('with challenge suggestion', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId, personId },
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
        assignmentType: { personId },
      },
    );
  });
});

describe('without challenge suggestion', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId, personId },
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
        assignmentType: { personId },
      },
    );
  });
});

describe('post', () => {
  it('renders without post', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId, personId },
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
        assignmentType: { personId },
      },
    );
  });

  it('renders with post', async () => {
    const { snapshot } = renderWithContext(<CompletedStepDetailScreen />, {
      initialState: { auth },
      navParams: { stepId, personId },
    });

    await flushMicrotasksQueue();
    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['step detail', 'completed step'],
      {
        assignmentType: { personId },
      },
    );
  });
});
