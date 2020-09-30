import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import i18next from 'i18next';

import { renderWithContext } from '../../../../../testUtils';
import { lookupOrgCommunityCode } from '../../../../actions/organizations';
import JoinGroupScreen from '..';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../../../../actions/organizations', () => ({
  lookupOrgCommunityCode: jest.fn(() => ({
    type: 'lookup',
    name: 'test',
  })),
  joinCommunity: jest.fn(() => ({
    type: 'join',
    name: 'test',
  })),
}));
jest.mock('../../../../actions/analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'track' })),
}));
jest.mock('../../../../utils/hooks/useAnalytics');

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

jest.spyOn(global, 'setTimeout');

describe('JoinGroupScreen', () => {
  it('renders start correctly', () => {
    renderWithContext(<JoinGroupScreen />).snapshot();
  });

  it('renders group card correctly', async () => {
    (lookupOrgCommunityCode as jest.Mock).mockReturnValue(() =>
      Promise.resolve(mockCommunity),
    );
    const { snapshot, getByText, getByTestId } = renderWithContext(
      // @ts-ignore
      <JoinGroupScreen next={mockNext} />,
    );

    fireEvent.changeText(
      getByTestId('joinInput'),
      mockCommunity.community_code,
    );

    await flushMicrotasksQueue();

    snapshot();

    expect(() => getByText(mockCommunity.name.toUpperCase())).not.toThrow();
  });

  it('renders error correctly', async () => {
    (lookupOrgCommunityCode as jest.Mock).mockReturnValue(() =>
      Promise.reject(),
    );

    const { getByText, getByTestId } = renderWithContext(
      // @ts-ignore
      <JoinGroupScreen next={mockNext} />,
    );

    fireEvent.changeText(
      getByTestId('joinInput'),
      mockCommunity.community_code,
    );

    await flushMicrotasksQueue();

    expect(() =>
      getByText(i18next.t('groupsJoinGroup:communityNotFound')),
    ).not.toThrow();
  });

  it('mounts and then focuses', () => {
    renderWithContext(<JoinGroupScreen />);

    expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 350);
  });

  describe('onSearch', () => {
    //tests for temporary implementation of onSearch
    //if input has 6 digits, community added to state
    //otherwise, error added to state
    it('should set input without calling serach has < 6 digits', () => {
      const { getByTestId, snapshot } = renderWithContext(
        // @ts-ignore
        <JoinGroupScreen next={mockNext} />,
      );
      fireEvent.changeText(getByTestId('joinInput'), '123');
      snapshot();
    });

    it('should set community after entering 6th digit', () => {
      const { getByTestId, snapshot } = renderWithContext(
        // @ts-ignore
        <JoinGroupScreen next={mockNext} />,
      );
      fireEvent.changeText(
        getByTestId('joinInput'),
        mockCommunity.community_code,
      );
      snapshot();
      expect(lookupOrgCommunityCode).toHaveBeenCalled();
    });
  });

  it('should join community', async () => {
    (lookupOrgCommunityCode as jest.Mock).mockReturnValue(() =>
      Promise.resolve(mockCommunity),
    );

    const { getByTestId } = renderWithContext(
      // @ts-ignore
      <JoinGroupScreen next={mockNext} />,
    );

    fireEvent.changeText(
      getByTestId('joinInput'),
      mockCommunity.community_code,
    );

    await flushMicrotasksQueue();

    fireEvent(getByTestId('groupCardItem'), 'onJoin');

    expect(mockNext).toHaveBeenCalledWith({ community: mockCommunity });
  });
});
