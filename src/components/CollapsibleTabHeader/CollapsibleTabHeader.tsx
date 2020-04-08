import React, {
  ReactNode,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Animated } from 'react-native';

import { Text } from '../common';
import {
  useCollapsibleHeader,
  CollapsibleHeaderContext,
} from './useCollapsibleHeader';
import { ScrollView } from 'react-native-gesture-handler';

interface CollapsibleTabHeaderProps {
  children?: ReactNode;
}

const TabHeader = () => <Text style={{ padding: 30 }}>Test</Text>;

export const CollapsibleTabHeader = ({ children }) => {
  const {
    collapsibleHeaderProps,
    collapsibleScrollViewProps,
  } = useCollapsibleHeader({
    headerHeight: 150,
    statusBarHeight: 100,
    // disableHeaderSnap: true,
  });

  const {
    collapsibleScrollViewProps: previousCollapsibleScrollViewProps,
    setCollapsibleScrollViewProps,
  } = useContext(CollapsibleHeaderContext);

  useEffect(
    () =>
      previousCollapsibleScrollViewProps !== collapsibleScrollViewProps &&
      setCollapsibleScrollViewProps(collapsibleScrollViewProps),
    [collapsibleScrollViewProps],
  );

  return (
    <Animated.View
      {...collapsibleHeaderProps}
      style={[...collapsibleHeaderProps.style, { zIndex: 1 }]}
    >
      {children}
    </Animated.View>
  );
};

export const CollapsibleTabContent = ({ children }) => {
  const { collapsibleScrollViewProps } = useContext(CollapsibleHeaderContext);

  return (
    <Animated.ScrollView
      {...collapsibleScrollViewProps}
      style={[collapsibleScrollViewProps?.style, { flex: 1 }]}
    >
      {children}
      {/* <ScrollView>
        {numbers.map(num => (
          <Text key={num} style={{ backgroundColor: 'yellow', padding: 20 }}>
            {num}
          </Text>
        ))}
      </ScrollView> */}
    </Animated.ScrollView>
  );
};
