import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

import {
  CollapsibleViewContent,
  CollapsibleViewContext,
} from '../../../../components/CollapsibleView/CollapsibleView';
import ImpactView from '../../../ImpactView';

interface CommunityImpactTabProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const CommunityImpactTab = ({
  collapsibleHeaderContext,
}: CommunityImpactTabProps) => {
  const communityId: string = useNavigationParam('communityId');
  const personId: string = useNavigationParam('personId');

  return (
    <CollapsibleViewContent context={collapsibleHeaderContext}>
      <ImpactView orgId={communityId} person={{ id: personId }} />
    </CollapsibleViewContent>
  );
};

export const COMMUNITY_IMPACT = 'nav/COMMUNITY_IMPACT';
