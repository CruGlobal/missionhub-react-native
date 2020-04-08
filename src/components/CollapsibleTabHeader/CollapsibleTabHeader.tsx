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

export const CollapsibleTabHeader = () => {
  const {
    collapsibleHeaderProps,
    collapsibleScrollViewProps,
  } = useCollapsibleHeader({
    headerHeight: 300,
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

  debugger;
  return (
    <Animated.View
      {...collapsibleHeaderProps}
      style={[
        ...collapsibleHeaderProps.style,
        { backgroundColor: 'tan', zIndex: 100 },
      ]}
    >
      <TabHeader />
    </Animated.View>
  );
};

export const TestCollapsibleTabContent = () => {
  const { collapsibleScrollViewProps } = useContext(CollapsibleHeaderContext);
  const [numbers] = useState([...Array(100).keys()]);
  debugger;

  return (
    <Animated.ScrollView {...collapsibleScrollViewProps}>
      <ScrollView>
        {numbers.map(num => (
          <Text key={num} style={{ backgroundColor: 'yellow', padding: 20 }}>
            {num}
          </Text>
        ))}
      </ScrollView>
    </Animated.ScrollView>
  );
};
