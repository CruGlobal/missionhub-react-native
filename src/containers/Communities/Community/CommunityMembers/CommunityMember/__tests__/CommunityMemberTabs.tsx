import React from 'react';

import { renderWithContext } from '../../../../../../../testUtils';
import { communityMemberTabs } from '../CommunityMemberTabs';

jest.mock('../../../../../ImpactTab/ImpactTab', () => ({
  ImpactTab: 'ImpactTab',
}));
jest.mock('../../../CommunityFeedTab/CommunityFeedTab', () => ({
  CommunityFeedTab: 'CommunityFeedTab',
}));

it('should render feed tab', () => {
  const FeedTab = communityMemberTabs[0].component;
  renderWithContext(<FeedTab />).snapshot();
});

it('should render impact tab', () => {
  const ImpactTab = communityMemberTabs[1].component;
  renderWithContext(<ImpactTab />).snapshot();
});
