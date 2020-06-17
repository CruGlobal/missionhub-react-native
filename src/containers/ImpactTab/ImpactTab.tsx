import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

import {
  CollapsibleViewContent,
  CollapsibleViewContext,
} from '../../components/CollapsibleView/CollapsibleView';
import ImpactView from '../ImpactView';

interface CommunityImpactTabProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const ImpactTab = ({
  collapsibleHeaderContext,
}: CommunityImpactTabProps) => {
  const communityId: string = useNavigationParam('communityId');
  const personId: string = useNavigationParam('personId');

  return (
    <CollapsibleViewContent context={collapsibleHeaderContext}>
      <ImpactView communityId={communityId} personId={personId} />
    </CollapsibleViewContent>
  );
};

export const IMPACT_TAB = 'nav/IMPACT_TAB';
