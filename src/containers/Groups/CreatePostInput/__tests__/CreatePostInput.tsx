import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { GLOBAL_COMMUNITY_ID } from '../../../../constants';
import { PostTypeEnum } from '../../../../components/PostTypeLabel';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../../CreatePostModal/queries';

import CreatePostInput from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');

const mockOrganization = {
  id: '1234',
};

const props = {
  communityId: mockOrganization.id,
};

const globalCommunityProps = {
  communityId: GLOBAL_COMMUNITY_ID,
};
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
  const { snapshot } = renderWithContext(<CreatePostInput {...props} />, {
    initialState,
  });
  snapshot();
});

it('renders correctly with type', () => {
  const { snapshot } = renderWithContext(
    <CreatePostInput {...props} type={PostTypeEnum.godStory} />,
    { initialState },
  );
  snapshot();
});

it('does not render for Global Community', () => {
  const { snapshot } = renderWithContext(
    <CreatePostInput {...globalCommunityProps} />,
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
  } = renderWithContext(<CreatePostInput {...props} />, { initialState });
  await flushMicrotasksQueue;
  recordSnapshot();
  fireEvent.press(getByTestId('CreatePostInput'));
  diffSnapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.communityId,
      myId: '1',
    },
  });
});
