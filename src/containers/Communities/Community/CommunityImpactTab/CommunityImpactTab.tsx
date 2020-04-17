import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

import { CollapsibleViewContent } from '../../../../components/CollapsibleView/CollapsibleView';
import { CommunitiesCollapsibleHeaderContext } from '../CommunityHeader/CommunityHeader';
import ImpactView from '../../../ImpactView';

export const CommunityImpactTab = () => {
  const communityId: string = useNavigationParam('communityId');

  return (
    <CollapsibleViewContent context={CommunitiesCollapsibleHeaderContext}>
      <ImpactView orgId={communityId} />
    </CollapsibleViewContent>
  );
};
