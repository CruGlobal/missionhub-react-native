import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { StepTypeEnum } from '../../../../__generated__/globalTypes';
import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { CREATE_STEP_FROM_SUGGESTION_MUTATION } from '../queries';
import { trackStepAdded } from '../../../actions/analytics';
import { updatePersonGQL } from '../../../actions/person';
import SuggestedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/person');
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
      mocks: {
        StepSuggestion: () => ({
          body: 'This step is for <<name>>',
          descriptionMarkdown: 'This description is for <<name>>',
        }),
      },
    },
  );

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'add step'], {
    sectionType: true,
    assignmentType: { personId },
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
    sectionType: true,
    assignmentType: { personId: myId },
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
    sectionType: true,
    assignmentType: { personId },
  });
});

describe('bottomButtonProps', () => {
  it('adds step', async () => {
    const personId = '111';
    const stepId = '222';
    const stageId = '333';
    const stepTitle = 'Step';
    const stepType = StepTypeEnum.care;

    const { getByTestId, store } = renderWithContext(
      <SuggestedStepDetailScreen next={next} />,
      {
        initialState,
        navParams: { stepSuggestionId, personId, orgId },
        mocks: {
          Person: () => ({
            id: personId,
          }),
          Step: () => ({
            id: stepId,
            title: stepTitle,
            stepType,
            post: () => null,
          }),
          StepSuggestion: () => ({
            id: stepSuggestionId,
            stage: {
              id: stageId,
            },
          }),
        },
      },
    );

    fireEvent.press(getByTestId('bottomButton'));
    await flushMicrotasksQueue();

    expect(useMutation).toHaveBeenMutatedWith(
      CREATE_STEP_FROM_SUGGESTION_MUTATION,
      {
        variables: {
          receiverId: personId,
          stepSuggestionId,
        },
      },
    );
    expect(updatePersonGQL).toHaveBeenCalledWith(personId);
    expect(next).toHaveBeenCalledWith({ personId, orgId });
    expect(store.getActions()).toEqual([trackStepAddedResponse, nextResponse]);
    expect(trackStepAdded).toHaveBeenCalledWith({
      __typename: 'Step',
      id: stepId,
      title: stepTitle,
      receiver: { __typename: 'Person', id: personId },
      post: null,
      stepSuggestion: {
        __typename: 'StepSuggestion',
        id: stepSuggestionId,
        stage: { __typename: 'Stage', id: stageId },
      },
      stepType,
    });
  });
});
