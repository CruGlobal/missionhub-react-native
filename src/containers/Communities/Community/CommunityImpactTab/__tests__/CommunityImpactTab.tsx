import React from 'react';

import { renderWithContext } from '../../../../../../testUtils';
import { CommunityImpactTab } from '../CommunityImpactTab';
import { CommunitiesCollapsibleHeaderContext } from '../../CommunityHeader/CommunityHeader';

jest.mock('../../../../ImpactView', () => 'ImpactView');

it('should render correctly', () => {
  renderWithContext(
    <CommunityImpactTab
      collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
    />,
    { navParams: { communityId: '1', personId: '2' } },
  ).snapshot();
});
