import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { navigateBack } from '../../../actions/navigation';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { CommunityFeedItem } from '../../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../../components/CommunityFeedItem/queries';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';
import { ADD_POST_TO_MY_STEPS } from '../queries';

import AddPostToStepsScreen from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');

MockDate.set('2020-05-11 12:00:00', 300);

const navigateBackResults = { type: 'navigate back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
});

const item = mockFragment<CommunityFeedItem>(COMMUNITY_FEED_ITEM_FRAGMENT);
const mockPostId = '1234';
const prayerPostSubject = mockFragment<CommunityFeedPost>(
  COMMUNITY_FEED_POST_FRAGMENT,
  {
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.prayer_request,
        id: () => mockPostId,
      }),
    },
  },
);

const carePostSubject = mockFragment<CommunityFeedPost>(
  COMMUNITY_FEED_POST_FRAGMENT,
  {
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.help_request,
      }),
    },
  },
);

const sharePostSubject = mockFragment<CommunityFeedPost>(
  COMMUNITY_FEED_POST_FRAGMENT,
  {
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.question,
      }),
    },
  },
);

const prayerPostItem = { ...item, subject: prayerPostSubject };
const carePostItem = { ...item, subject: carePostSubject };
const sharePostItem = { ...item, subject: sharePostSubject };

it('should render correctly | Pray Step', () => {
  renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      item: prayerPostItem,
    },
  }).snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});

it('should render correctly | Care Step', () => {
  renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      item: carePostItem,
    },
  }).snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});

it('should render correctly | Share Step', () => {
  renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      item: sharePostItem,
    },
  }).snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['add steps', 'step detail']);
});

it('creates a new step when user clicks add to my steps button', async () => {
  const { getByTestId } = renderWithContext(<AddPostToStepsScreen />, {
    navParams: {
      item: prayerPostItem,
    },
  });
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
