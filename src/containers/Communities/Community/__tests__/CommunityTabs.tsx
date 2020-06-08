import React from 'react';

import { renderWithContext } from '../../../../../testUtils';
import { communityTabs } from '../constants';
import GroupChallenges from '../../../Groups/GroupChallenges';

jest.mock('../../../Groups/GroupCelebrate', () => 'CommunityFeed');
jest.mock('../CommunityImpactTab/CommunityImpactTab', () => ({
  CommunityImpactTab: 'CommunityImpactTab',
}));

it('should render feed tab', () => {
  const FeedTab = communityTabs[0].component;
  renderWithContext(
    <FeedTab
      navigation={{
        state: {
          params: {
            communityId: '1',
          },
        },
      }}
    />,
  ).snapshot();
});

it('should render challenges tab', () => {
  expect(communityTabs[1].component).toEqual(GroupChallenges);
});

it('should render impact tab', () => {
  const ImpactTab = communityTabs[2].component;
  renderWithContext(
    <ImpactTab
      navigation={{
        state: {
          params: {
            communityId: '1',
          },
        },
      }}
    />,
  ).snapshot();
});
