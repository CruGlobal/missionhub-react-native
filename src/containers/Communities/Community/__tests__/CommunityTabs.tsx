import React from 'react';

import { renderWithContext } from '../../../../../testUtils';
import { communityTabs } from '../constants';
import GroupChallenges from '../../../Groups/GroupChallenges';

jest.mock('../CommunityFeedTab/CommunityFeedTab', () => ({
  CommunityFeedTab: 'CommunityFeedTab',
}));
jest.mock('../../../ImpactTab/ImpactTab', () => ({
  ImpactTab: 'ImpactTab',
}));

it('should render feed tab', () => {
  const FeedTab = communityTabs[0].component;
  renderWithContext(<FeedTab />, {
    navParams: {
      communityId: '1',
    },
  }).snapshot();
});

it('should render challenges tab', () => {
  expect(communityTabs[1].component).toEqual(GroupChallenges);
});

it('should render impact tab', () => {
  const ImpactTab = communityTabs[2].component;
  renderWithContext(<ImpactTab />, {
    navParams: {
      communityId: '1',
    },
  }).snapshot();
});
