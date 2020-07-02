import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { trackStepAdded } from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import { getPersonDetails } from '../../../actions/person';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  ADD_POST_TO_MY_STEPS,
  ADD_POST_TO_MY_STEPS_SCREEN_DETAILS_QUERY,
} from '../queries';
import {
  PostTypeEnum,
  PostStepStatusEnum,
  StepTypeEnum,
} from '../../../../__generated__/globalTypes';

import AddPostToStepsScreen from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../utils/hooks/useAnalytics');

MockDate.set('2020-05-11 12:00:00', 300);

const trackStepResults = { type: 'track step added' };
const navigateBackResults = { type: 'navigate back' };
const getPersonDetailsResponse = { type: 'get person details' };

beforeEach(() => {
  (trackStepAdded as jest.Mock).mockReturnValue(trackStepResults);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResponse);
});

const feedItemId = '1';
const mockPostId = '1234';
const stepId = '2';
const stepTitle = 'Step';
const personId = '3';

it('should render correctly | Pray Step', async () => {
  const { snapshot } = renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      feedItemId,
    },
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.prayer_request,
      }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});

it('should render correctly | Care Step', async () => {
  const { snapshot } = renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      feedItemId,
    },
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.help_request,
      }),
    },
  });

  await flushMicrotasksQueue();

  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});

it('should render correctly | Share Step', async () => {
  const { snapshot } = renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      feedItemId,
    },
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.question,
      }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});

it('creates a new step when user clicks add to my steps button', async () => {
  const { getByTestId } = renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      feedItemId,
    },
    mocks: {
      Person: () => ({
        id: personId,
      }),
      Post: () => ({
        id: mockPostId,
        postType: () => PostTypeEnum.prayer_request,
        stepStatus: () => PostStepStatusEnum.NONE,
      }),
      Step: () => ({
        id: stepId,
        title: stepTitle,
        stepType: StepTypeEnum.pray,
        stepSuggestion: () => null,
      }),
    },
  });
  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('AddToMyStepsButton'));
  await flushMicrotasksQueue();

  expect(trackStepAdded).toHaveBeenCalledWith({
    __typename: 'Step',
    id: stepId,
    title: stepTitle,
    stepType: StepTypeEnum.pray,
    post: {
      __typename: 'Post',
      id: mockPostId,
      postType: PostTypeEnum.prayer_request,
      stepStatus: PostStepStatusEnum.NONE,
    },
    receiver: {
      __typename: 'Person',
      id: personId,
    },
    stepSuggestion: null,
  });
  expect(getPersonDetails).toHaveBeenCalledWith(personId);
  expect(navigateBack).toHaveBeenCalled();
  expect(useMutation).toHaveBeenMutatedWith(ADD_POST_TO_MY_STEPS, {
    variables: {
      input: {
        postId: mockPostId,
        title: "Pray for Hayden's request.",
      },
    },
  });
  expect(useQuery).toHaveBeenCalledWith(
    ADD_POST_TO_MY_STEPS_SCREEN_DETAILS_QUERY,
    {
      onCompleted: expect.any(Function),
      variables: {
        feedItemId,
      },
    },
  );
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});

it('changes the title of the step and creates a new step', async () => {
  const mockNewStepTitle = "Pray for Christian's super cool request!";

  const { getByTestId, diffSnapshot, recordSnapshot } = renderWithContext(
    <AddPostToStepsScreen />,
    {
      navParams: {
        feedItemId,
      },
      mocks: {
        Person: () => ({
          id: personId,
        }),
        Post: () => ({
          id: mockPostId,
          postType: () => PostTypeEnum.prayer_request,
          stepStatus: () => PostStepStatusEnum.NONE,
        }),
        Step: () => ({
          id: stepId,
          title: mockNewStepTitle,
          stepType: StepTypeEnum.pray,
          stepSuggestion: () => null,
        }),
      },
    },
  );

  await flushMicrotasksQueue();

  recordSnapshot();

  fireEvent(getByTestId('stepTitleInput'), 'onChangeText', mockNewStepTitle);

  diffSnapshot();
  fireEvent.press(getByTestId('AddToMyStepsButton'));
  await flushMicrotasksQueue();

  expect(trackStepAdded).toHaveBeenCalledWith({
    __typename: 'Step',
    id: stepId,
    title: mockNewStepTitle,
    stepType: StepTypeEnum.pray,
    post: {
      __typename: 'Post',
      id: mockPostId,
      postType: PostTypeEnum.prayer_request,
      stepStatus: PostStepStatusEnum.NONE,
    },
    receiver: {
      __typename: 'Person',
      id: personId,
    },
    stepSuggestion: null,
  });
  expect(getPersonDetails).toHaveBeenCalledWith(personId);
  expect(navigateBack).toHaveBeenCalled();
  expect(useMutation).toHaveBeenMutatedWith(ADD_POST_TO_MY_STEPS, {
    variables: {
      input: {
        postId: mockPostId,
        title: mockNewStepTitle,
      },
    },
  });
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});
