import React from 'react';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../testUtils';
import { CommunityHeader } from '../CommunityHeader';
import { GLOBAL_COMMUNITY_ID } from '../../../../../constants';
import { COMMUNITY_PROFILE } from '../../CommunityProfile/CommunityProfile';
import { navigatePush } from '../../../../../actions/navigation';
import { COMMUNITY_MEMBERS } from '../../CommunityMembers/CommunityMembers';

jest.mock('../../../../../actions/navigation');

(navigatePush as jest.Mock).mockReturnValue({ type: 'navigatePush' });

const communityId = '1';

const initialState = { auth: { person: { id: '2' } } };

describe('CommunityHeader', () => {
  it('should render loading state', () => {
    renderWithContext(<CommunityHeader />, {
      initialState,
      navParams: { communityId },
    }).snapshot();
  });

  it('should render global community loading', () => {
    renderWithContext(<CommunityHeader />, {
      initialState,
      navParams: { communityId: GLOBAL_COMMUNITY_ID },
    }).snapshot();
  });

  it('should render community details', async () => {
    const { recordSnapshot, diffSnapshot } = renderWithContext(
      <CommunityHeader />,
      {
        initialState,
        navParams: { communityId },
      },
    );

    recordSnapshot();
    await flushMicrotasksQueue();
    diffSnapshot();
  });

  it('should render global community details', async () => {
    const { recordSnapshot, diffSnapshot } = renderWithContext(
      <CommunityHeader />,
      {
        initialState,
        navParams: { communityId: GLOBAL_COMMUNITY_ID },
      },
    );

    recordSnapshot();
    await flushMicrotasksQueue();
    diffSnapshot();
  });
  it('should navigate to the community profile screen', () => {
    const { getByTestId } = renderWithContext(<CommunityHeader />, {
      initialState,
      navParams: { communityId },
    });

    fireEvent.press(getByTestId('communityProfileButton'));
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_PROFILE, {
      communityId,
    });
  });
  it('should navigate to the community members screen', () => {
    const { getByTestId } = renderWithContext(<CommunityHeader />, {
      initialState,
      navParams: { communityId },
    });

    fireEvent.press(getByTestId('communityMembersButton'));
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_MEMBERS, {
      communityId,
    });
  });
  it('should not navigate to the community members screen for global community', () => {
    const { getByTestId } = renderWithContext(<CommunityHeader />, {
      initialState,
      navParams: { communityId: GLOBAL_COMMUNITY_ID },
    });

    fireEvent.press(getByTestId('communityMembersButton'));
    expect(navigatePush).not.toHaveBeenCalled();
  });
});
