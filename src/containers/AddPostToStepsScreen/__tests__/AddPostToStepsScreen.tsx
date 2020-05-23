import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { ADD_POST_TO_MY_STEPS } from '../queries';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';

import AddPostToStepsScreen from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');

MockDate.set('2020-05-11 12:00:00', 300);

const navigateBackResults = { type: 'navigate back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
});

const feedItemId = '1';
const mockPostId = '1234';

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
      Post: () => ({
        id: mockPostId,
        postType: () => PostTypeEnum.prayer_request,
      }),
    },
  });
  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('AddToMyStepsButton'));
  await flushMicrotasksQueue();
  expect(navigateBack).toHaveBeenCalled();
  expect(useMutation).toHaveBeenMutatedWith(ADD_POST_TO_MY_STEPS, {
    variables: {
      input: {
        postId: mockPostId,
        title: "Pray for Hayden's request.",
      },
    },
  });
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});
