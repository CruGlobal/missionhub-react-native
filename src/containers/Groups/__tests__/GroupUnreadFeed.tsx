import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import GroupUnreadFeed from '../GroupUnreadFeed';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { organizationSelector } from '../../../selectors/organizations';
import {
  markCommentsRead,
  markCommentRead,
} from '../../../actions/unreadComments';
import { refreshCommunity } from '../../../actions/organizations';
import { Organization } from '../../../reducers/organizations';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/organizations');
jest.mock('../../Analytics', () => 'Analytics');
jest.mock('../../CelebrateFeed', () => 'CelebrateFeed');

MockDate.set('2017-06-18');
const organization: Organization = { id: 'orgId' };

const initialState = {
  organizations: {
    all: [organization],
  },
};

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigateBack' });
  (markCommentsRead as jest.Mock).mockReturnValue({ type: 'markCommentsRead' });
  (markCommentRead as jest.Mock).mockReturnValue({ type: 'markCommentRead' });
  (refreshCommunity as jest.Mock).mockReturnValue({ type: 'refreshCommunity' });
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(
    organization,
  );
});

it('should render items correctly', () => {
  renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { organization },
  }).snapshot();
});

it('should call mark comments read and go back', async () => {
  const { getByTestId } = renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { organization },
  });

  await fireEvent.press(getByTestId('MarkAllButton'));

  expect(markCommentsRead).toHaveBeenCalledWith(organization.id);
  expect(navigateBack).toHaveBeenCalled();
});

it('should call mark specific celebration item comments as read and go back', () => {
  const { getByTestId } = renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { organization },
  });

  const event = { id: '1' };

  fireEvent(getByTestId('CelebrateFeed'), 'onClearNotification', event);

  expect(markCommentRead).toHaveBeenCalledWith(event.id);
});

it('should refetch correctly', () => {
  const { getByTestId } = renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { organization },
  });

  fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

  expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
});
