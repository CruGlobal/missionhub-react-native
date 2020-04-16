import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { GLOBAL_COMMUNITY_ID } from '../../../../constants';
import { PostTypeEnum } from '../../../../components/PostTypeLabel';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../queries';

import CreatePostInput from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');

const mockOrganization = {
  id: '1234',
};

const props = {
  orgId: mockOrganization.id,
};

const globalCommunityProps = {
  orgId: GLOBAL_COMMUNITY_ID,
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

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<CreatePostInput {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.orgId,
      myId: '1',
    },
    skip: false,
  });
});

it('renders correctly with type', async () => {
  const { snapshot } = renderWithContext(
    <CreatePostInput {...props} type={PostTypeEnum.godStory} />,
    { initialState },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.orgId,
      myId: '1',
    },
    skip: false,
  });
});

it('does not render for Global Community', async () => {
  const { snapshot } = renderWithContext(
    <CreatePostInput {...globalCommunityProps} />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: globalCommunityProps.orgId,
      myId: '1',
    },
    skip: true,
  });
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
      id: props.orgId,
      myId: '1',
    },
    skip: false,
  });
});
