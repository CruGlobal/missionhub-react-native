import React from 'react';
import { View } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';

import {
  CollapsibleViewContent,
  CollapsibleViewContext,
} from '../../components/CollapsibleView/CollapsibleView';
import ImpactView from '../ImpactView';

import styles from './styles';

interface CommunityImpactTabProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const ImpactTab = ({
  collapsibleHeaderContext,
}: CommunityImpactTabProps) => {
  const communityId: string = useNavigationParam('communityId');
  const personId: string = useNavigationParam('personId');

  return (
    <>
      <View style={styles.backgroundWrapper}>
        <View style={styles.backgroundTop} />
        <View style={styles.backgroundBottom} />
      </View>
      <CollapsibleViewContent context={collapsibleHeaderContext}>
        <ImpactView communityId={communityId} personId={personId} />
      </CollapsibleViewContent>
    </>
  );
};

export const IMPACT_TAB = 'nav/IMPACT_TAB';
