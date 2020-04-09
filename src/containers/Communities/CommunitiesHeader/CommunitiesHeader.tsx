import React from 'react';
import { View } from 'react-native';

import {
  createCollapsibleViewContext,
  CollapsibleViewHeader,
} from '../../../components/CollapsibleView/CollapsibleView';
import { Text } from '../../../components/common';

export const CommunitiesCollapsibleHeaderContext = createCollapsibleViewContext();

export const CommunitiesHeader = () => (
  <CollapsibleViewHeader
    context={CommunitiesCollapsibleHeaderContext}
    headerHeight={100}
  >
    <View style={{ backgroundColor: 'tan' }}>
      <Text style={{ padding: 100 }}>Header</Text>
    </View>
  </CollapsibleViewHeader>
);
