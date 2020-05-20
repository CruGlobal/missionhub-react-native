import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { GLOBAL_COMMUNITY_ID } from '../../../../constants';
import {
  FeedItemSubjectTypeEnum,
  PermissionEnum,
  PostTypeEnum,
} from '../../../../../__generated__/globalTypes';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../queries';
import { navigatePush } from '../../../../actions/navigation';
import { CREATE_POST_SCREEN } from '../../CreatePostScreen';

import { CreatePostButton } from '..';

jest.mock('../../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'navigatePush' })),
}));
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../selectors/people');

const refreshItems = jest.fn();
const mockCommunityId = '1';
const props = {
  refreshItems,
  communityId: mockCommunityId,
};
const initialState = {
  auth: { person: { id: '1' } },
  people: { allByOrg: {} },
  drawer: { isOpen: false },
};

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<CreatePostButton {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: { id: mockCommunityId, myId: '1' },
  });
});

it('renders correctly for admin', async () => {
  const { snapshot } = renderWithContext(<CreatePostButton {...props} />, {
    initialState,
    mocks: {
      CommunityPermission: () => ({ permission: PermissionEnum.admin }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: { id: mockCommunityId, myId: '1' },
  });
});
it('renders correctly for owner', async () => {
  const { snapshot } = renderWithContext(<CreatePostButton {...props} />, {
    initialState,
    mocks: {
      CommunityPermission: () => ({ permission: PermissionEnum.owner }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: { id: mockCommunityId, myId: '1' },
  });
});

it('renders correctly with type', () => {
  renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.STORY} />,
    { initialState },
  ).snapshot();
});

it('does not render for Global Community', () => {
  renderWithContext(
    <CreatePostButton {...props} communityId={GLOBAL_COMMUNITY_ID} />,
    { initialState },
  ).snapshot();
});

it('does not render for step', () => {
  renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.STEP} />,
    { initialState },
  ).snapshot();
});

it('does not render announcement', async () => {
  const { snapshot } = renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.ANNOUNCEMENT} />,
    { initialState },
  );
  await flushMicrotasksQueue();
  snapshot();
});

it('does render announcement for owner', async () => {
  const { snapshot } = renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.ANNOUNCEMENT} />,
    {
      initialState,
      mocks: {
        CommunityPermission: () => ({ permission: PermissionEnum.admin }),
      },
    },
  );
  await flushMicrotasksQueue();
  snapshot();
});

it('onPress opens modal', async () => {
  const {
    getByTestId,
    recordSnapshot,
    diffSnapshot,
  } = renderWithContext(<CreatePostButton {...props} />, { initialState });

  await flushMicrotasksQueue();
  recordSnapshot();

  fireEvent.press(getByTestId('CreatePostButton'));
  diffSnapshot();
});

it('onPress navigates for PRAYER_REQUEST ', async () => {
  const { getByTestId } = renderWithContext(
    <CreatePostButton
      {...props}
      type={FeedItemSubjectTypeEnum.PRAYER_REQUEST}
    />,
    { initialState },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CreatePostButton'));
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.prayer_request,
  });
});

it('onPress navigates for QUESTION ', async () => {
  const { getByTestId } = renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.QUESTION} />,
    { initialState },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CreatePostButton'));
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.question,
  });
});

it('onPress navigates for STORY ', async () => {
  const { getByTestId } = renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.STORY} />,
    { initialState },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CreatePostButton'));
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.story,
  });
});

it('onPress navigates for HELP_REQUEST ', async () => {
  const { getByTestId } = renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.HELP_REQUEST} />,
    { initialState },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CreatePostButton'));
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.help_request,
  });
});

it('onPress navigates for THOUGHT ', async () => {
  const { getByTestId } = renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.THOUGHT} />,
    { initialState },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CreatePostButton'));
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.thought,
  });
});

it('onPress navigates for ANNOUNCEMENT ', async () => {
  const { getByTestId } = renderWithContext(
    <CreatePostButton {...props} type={FeedItemSubjectTypeEnum.ANNOUNCEMENT} />,
    {
      initialState,
      mocks: {
        CommunityPermission: () => ({ permission: PermissionEnum.admin }),
      },
    },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CreatePostButton'));
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.announcement,
  });
});
