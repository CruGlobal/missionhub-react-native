import React from 'react';
import { ScrollView, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { useNavigationState } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';

import { Touchable } from '../common';

import styles from './styles';

export type HeaderTabs = { name: string; navigationAction: string }[];

interface HeaderTabBarProps {
  tabs: HeaderTabs;
}

export const HeaderTabBar = ({ tabs }: HeaderTabBarProps) => {
  const dispatch = useDispatch();
  const navState = useNavigationState();

  const navigateToTab = (index: number) => {
    if (index !== navState.index && tabs[index]) {
      dispatch(
        NavigationActions.navigate({
          routeName: tabs[index].navigationAction,
          params: navState.params,
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
              index === navState.index ? styles.tabTextActive : styles.tabText
            }
          >
            {tab.name}
          </Text>
        </Touchable>
      ))}
    </ScrollView>
  );
};
