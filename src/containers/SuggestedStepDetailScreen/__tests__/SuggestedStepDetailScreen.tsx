import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { CREATE_STEP_FROM_SUGGESTION_MUTATION } from '../queries';
import { trackStepAdded } from '../../../actions/analytics';

import SuggestedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../utils/hooks/useAnalytics');

const myId = '4444';
const stepSuggestionId = '1';
const personId = '423325';
const orgId = '880124';

const nextResponse = { type: 'next' };
const trackStepAddedResponse = { type: 'trackStepAdded' };

const next = jest.fn();

const initialState = {
  auth: { person: { id: myId } },
  onboarding: { currentlyOnboarding: false },
};

beforeEach(() => {
  next.mockReturnValue(nextResponse);
  (trackStepAdded as jest.Mock).mockReturnValue(trackStepAddedResponse);
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(
    <SuggestedStepDetailScreen next={next} />,
    {
      initialState,
      navParams: { stepSuggestionId, personId, orgId },
    },
  );

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'add step'], {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: '',
      [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
    },
  });
});

it('renders correctly for me', async () => {
  const { snapshot } = renderWithContext(
    <SuggestedStepDetailScreen next={next} />,
    {
      initialState,
      navParams: { stepSuggestionId, personId: myId, orgId },
    },
  );

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'add step'], {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: '',
      [ANALYTICS_ASSIGNMENT_TYPE]: 'self',
    },
  });
});

it('renders correctly in onboarding', async () => {
  const { snapshot } = renderWithContext(
    <SuggestedStepDetailScreen next={next} />,
    {
      initialState: {
        auth: { person: { id: myId } },
        onboarding: { currentlyOnboarding: true },
      },
      navParams: { stepSuggestionId, personId, orgId },
    },
  );

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'add step'], {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: 'onboarding',
      [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
    },
  });
});

describe('bottomButtonProps', () => {
  it('adds step', async () => {
    const { getByTestId, store } = renderWithContext(
      <SuggestedStepDetailScreen next={next} />,
      {
        initialState,
        navParams: { stepSuggestionId, personId, orgId },
      },
    );

    fireEvent.press(getByTestId('bottomButton'));
    await flushMicrotasksQueue();

    expect(useMutation).toHaveBeenMutatedWith(
      CREATE_STEP_FROM_SUGGESTION_MUTATION,
      {
        variables: {
          receiverId: personId,
          communityId: orgId,
          stepSuggestionId,
        },
      },
    );
    expect(next).toHaveBeenCalledWith({ personId, orgId });
    expect(store.getActions()).toEqual([trackStepAddedResponse, nextResponse]);
    expect(trackStepAdded).toHaveBeenCalledWith({
      __typename: 'Step',
      receiver: { __typename: 'Person', id: '1' },
      stepSuggestion: {
        __typename: 'StepSuggestion',
        id: '2',
        stage: { __typename: 'Stage', id: '3' },
      },
      stepType: 'care',
    });
  });
});
