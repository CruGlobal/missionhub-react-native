import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { GLOBAL_COMMUNITY_ID } from '../../../../constants';
import { PostTypeEnum } from '../../../../components/PostTypeLabel';

import CreatePostInput from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');

const mockOrganization = {
  id: '1234',
};

const props = {
  organization: mockOrganization,
};

const globalCommunityProps = {
  ...props,
  organization: {
    id: GLOBAL_COMMUNITY_ID,
  },
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
  renderWithContext(<CreatePostInput {...props} />, {
    initialState,
  }).snapshot();
});

it('renders correctly with type', () => {
  renderWithContext(
    <CreatePostInput {...props} type={PostTypeEnum.godStory} />,
    { initialState },
  ).snapshot();
});

it('does not render for Global Community', () => {
  renderWithContext(<CreatePostInput {...globalCommunityProps} />, {
    initialState,
  }).snapshot();
});

it('onPress opens modal', () => {
  const {
    getByTestId,
    recordSnapshot,
    diffSnapshot,
  } = renderWithContext(<CreatePostInput {...props} />, { initialState });
  recordSnapshot();
  fireEvent.press(getByTestId('CreatePostInput'));
  diffSnapshot();
});
