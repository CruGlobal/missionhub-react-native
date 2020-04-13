import React from 'react';
import { ScrollView, View } from 'react-native';
// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';
import { useNavigationState } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';

import { Touchable, Text } from '../common';

import styles from './styles';

interface HeaderTabBarProps {
  tabs: { name: string; navigationAction: string }[];
}

export const HeaderTabBar = ({ tabs }: HeaderTabBarProps) => {
  const dispatch = useDispatch();
  const navState = useNavigationState();

  const navigateToTab = (index: number) => {
    if (index !== navState.index && tabs[index]) {
      dispatch(
        NavigationActions.navigate({
          routeName: tabs[index].navigationAction,
          params: {},
        }),
      );
    }
  };

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.tabContainer}
      showsHorizontalScrollIndicator={false}
      bounces={false}
    >
      {tabs.map((tab, index: number) => (
        <Touchable
          key={tab.navigationAction}
          onPress={() => navigateToTab(index)}
          style={[
            styles.tab,
            index === navState.index ? styles.tabActive : null,
          ]}
        >
          <Text
            numberOfLines={1}
            style={
              index === navState.index
                ? styles.tabTextActiveLight
                : styles.tabTextLight
            }
          >
            {tab.name}
          </Text>
        </Touchable>
      ))}
    </ScrollView>
  );
};
