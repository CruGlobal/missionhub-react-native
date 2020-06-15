import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { CommunitiesCollapsibleHeaderContext } from '../../Communities/Community/CommunityHeader/CommunityHeader';
import { ImpactTab } from '../ImpactTab';

jest.mock('../../ImpactView', () => 'ImpactView');

it('should render correctly', () => {
  renderWithContext(
    <ImpactTab
      collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
    />,
    { navParams: { communityId: '1', personId: '2' } },
  ).snapshot();
});
