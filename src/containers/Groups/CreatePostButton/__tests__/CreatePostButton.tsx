import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { GLOBAL_COMMUNITY_ID } from '../../../../constants';
import { PostTypeEnum } from '../../../../../__generated__/globalTypes';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../../CreatePostModal/queries';

import { CreatePostButton } from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');

const communityId = '1234';

const refreshItems = jest.fn();

const initialState = {
  auth: {
    person: {
      id: '1',
    },
  },
  people: { allByOrg: {} },
  drawer: { isOpen: false },
};

it('renders correctly', () => {
  const { snapshot } = renderWithContext(
    <CreatePostButton
      refreshItems={refreshItems}
      type={PostTypeEnum.story}
      communityId={communityId}
    />,
    {
      initialState,
    },
  );
  snapshot();
});

it('renders correctly with type', () => {
  const { snapshot } = renderWithContext(
    <CreatePostButton
      refreshItems={refreshItems}
      type={PostTypeEnum.story}
      communityId={communityId}
    />,
    { initialState },
  );
  snapshot();
});

it('does not render for Global Community', () => {
  const { snapshot } = renderWithContext(
    <CreatePostButton
      refreshItems={refreshItems}
      type={PostTypeEnum.story}
      communityId={GLOBAL_COMMUNITY_ID}
    />,
    {
      initialState,
    },
  );
  snapshot();
});

it('onPress opens modal', async () => {
  const {
    getByTestId,
    recordSnapshot,
    diffSnapshot,
  } = renderWithContext(
    <CreatePostButton
      refreshItems={refreshItems}
      type={PostTypeEnum.story}
      communityId={communityId}
    />,
    { initialState },
  );

  await flushMicrotasksQueue();
  recordSnapshot();

  fireEvent.press(getByTestId('CreatePostButton'));
  diffSnapshot();

  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: communityId,
      myId: '1',
    },
  });
});
