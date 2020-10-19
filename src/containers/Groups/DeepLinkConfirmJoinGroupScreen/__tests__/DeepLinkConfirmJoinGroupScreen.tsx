import React from 'react';
import i18next from 'i18next';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { navigateBack } from '../../../../actions/navigation';
import DeepLinkConfirmJoinGroupScreen from '..';
import { lookupOrgCommunityUrl } from '../../../../actions/organizations';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../../../../actions/organizations', () => ({
  lookupOrgCommunityUrl: jest.fn(),
  joinCommunity: jest.fn(() => ({
    type: 'join',
    name: 'test',
  })),
}));
jest.mock('../../../../actions/analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'trackActionWithoutData' })),
  trackScreenChange: jest.fn(() => ({ type: 'trackScreenChange' })),
}));

const mockCommunity = {
  id: '123',
  community_code: '123456',
  name: 'Org Name',
  owner: { first_name: 'Owner', last_name: 'Ofthisgroup' },
  contactReport: { memberCount: 2 },
  unread_comments_count: 0,
  community_photo_url: 'www.missionhub.com',
};

const mockNext = jest.fn(() => ({ type: 'nextTest' }));

const initialState = {
  onboarding: {},
  drawer: {},
};

describe('DeepLinkConfirmJoinGroupScreen', () => {
  it('renders start correctly', () => {
    renderWithContext(
      // @ts-ignore
      <DeepLinkConfirmJoinGroupScreen next={mockNext} />,
      { initialState },
    ).snapshot();
  });

  it('renders group card correctly', async () => {
    (lookupOrgCommunityUrl as jest.Mock).mockReturnValue(() =>
      Promise.resolve(mockCommunity),
    );

    const { snapshot, getByText } = renderWithContext(
      // @ts-ignore
      <DeepLinkConfirmJoinGroupScreen next={mockNext} />,
      { initialState },
    );

    await flushMicrotasksQueue();

    snapshot();

    expect(() => getByText(mockCommunity.name.toUpperCase())).not.toThrow();
  });

  it('renders error correctly', async () => {
    (lookupOrgCommunityUrl as jest.Mock).mockReturnValue(() =>
      Promise.reject(),
    );

    const { getByText } = renderWithContext(
      // @ts-ignore
      <DeepLinkConfirmJoinGroupScreen next={mockNext} />,
      { initialState },
    );

    await flushMicrotasksQueue();

    expect(() =>
      getByText(i18next.t('groupsJoinGroup:communityNotFoundLink')),
    ).not.toThrow();
  });

  it('should join community', async () => {
    (lookupOrgCommunityUrl as jest.Mock).mockReturnValue(() =>
      Promise.resolve(mockCommunity),
    );

    const { getByTestId } = renderWithContext(
      // @ts-ignore
      <DeepLinkConfirmJoinGroupScreen next={mockNext} />,
      { initialState },
    );

    await flushMicrotasksQueue();

    fireEvent(getByTestId('groupCardItem'), 'onJoin');

    expect(mockNext).toHaveBeenCalledWith({ community: mockCommunity });
  });

  it('should call navigate back', () => {
    const { getByTestId } = renderWithContext(
      // @ts-ignore
      <DeepLinkConfirmJoinGroupScreen next={mockNext} />,
      { initialState },
    );

    fireEvent.press(getByTestId('backButton'));

    expect(navigateBack).toHaveBeenCalled();
  });
});
