/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint max-params: 0, max-lines-per-function: 0 */

import React, { Component, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
  CollapsibleHeaderScrollView,
  CollapsibleHeaderProps,
} from 'react-native-collapsible-header-views';
// @ts-ignore
import ViewOverflow from 'react-native-view-overflow';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';
// @ts-ignore
import { useNavigationParam } from 'react-navigation-hooks';

import { Flex, Touchable } from '../common';
import { isAndroid } from '../../utils/common';
import Header from '../Header';
import BackButton from '../../containers/BackButton';
import theme from '../../theme';
import { OrganizationsState, Organization } from '../../reducers/organizations';
import { organizationSelector } from '../../selectors/organizations';

import styles from './styles';

// TRY THIS: https://codeburst.io/react-native-parallax-scroll-with-tabs-721feec463c5
const CurrentTab = React.memo(({ tabs, initialTab, params }: any) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const initialIndex = tabs.findIndex(
      (tab: any) => tab.navigationAction === initialTab,
    );

    if (initialIndex !== -1) {
      return initialIndex;
    }
    return 0;
  });

  return (
    <View style={{ position: 'relative' }}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          flex: 1,
          height: 50,
          // position: 'absolute',
          // left: 0,
          // right: 0,
          // top: 100,
        }}
      >
        {tabs.map((tab: any, index: number) => (
          <Touchable
            key={tab.navigationAction}
            withoutFeedback={true}
            pressProps={[index]}
            onPress={() => setCurrentIndex(index)}
          >
            <View
              style={[
                styles.menuItem,
                index === currentIndex ? styles.menuItemActive : null,
              ]}
            >
              <Text
                numberOfLines={1}
                style={
                  index === currentIndex
                    ? styles.menuItemTextActiveLight
                    : styles.menuItemTextLight
                }
              >
                {tab.name}
              </Text>
            </View>
          </Touchable>
        ))}
      </ScrollView>
      {/* {tabs[currentIndex].render(params)} */}
      <View style={{ height: 1000, backgroundColor: 'rgba(0, 0, 150, 0.3)' }} />
    </View>
  );
});

const CurrentTabHeader = React.memo(({ tabs, currentIndex, onChange }: any) => {
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{
        flex: 1,
        height: 50,
        // position: 'absolute',
        // left: 0,
        // right: 0,
        // top: 100,
      }}
    >
      {tabs.map((tab: any, index: number) => (
        <Touchable
          key={tab.navigationAction}
          withoutFeedback={true}
          pressProps={[index]}
          onPress={() => onChange(index)}
        >
          <View
            style={[
              styles.menuItem,
              index === currentIndex ? styles.menuItemActive : null,
            ]}
          >
            <Text
              numberOfLines={1}
              style={
                index === currentIndex
                  ? styles.menuItemTextActiveLight
                  : styles.menuItemTextLight
              }
            >
              {tab.name}
            </Text>
          </View>
        </Touchable>
      ))}
    </ScrollView>
  );
});

export function ParallaxTabMenu(props: { tabs: any[] }) {
  const { tabs } = props;

  const orgId: string = useNavigationParam('orgId');
  const initialTab: string = useNavigationParam('initialTab');
  const dispatch = useDispatch();
  const organization = useSelector<
    { organizations: OrganizationsState },
    Organization
  >(({ organizations }) => organizationSelector({ organizations }, { orgId }));
  // const currentIndex = 0;

  const [currentIndex, setCurrentIndex] = useState(() => {
    const initialIndex = tabs.findIndex(
      (tab: any) => tab.navigationAction === initialTab,
    );

    if (initialIndex !== -1) {
      return initialIndex;
    }
    return 0;
  });

  const Header2 = ({
    interpolatedHeaderTranslation,
  }: CollapsibleHeaderProps) => (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        {
          // opacity: interpolatedHeaderTranslation(1, 0),
          // transform: [
          //   { translateX: interpolatedHeaderTranslation(0, theme.fullWidth) },
          // ],
        },
      ]}
    >
      <Animated.View
        style={[
          // styles.parallaxContent,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: theme.fullWidth,
            backgroundColor: 'black',
            height: 125,
          },
          {
            opacity: interpolatedHeaderTranslation(1, 0),
            // height: interpolatedHeaderTranslation(200, 0),
          },
        ]}
      >
        <Text style={[styles.orgName, { color: 'blue' }]} numberOfLines={2}>
          {(organization || {}).name || '-'}
        </Text>
        <Text style={{ color: 'blue' }}>24 members</Text>
      </Animated.View>

      <Animated.View
        style={[
          { width: theme.fullWidth },
          {
            opacity: interpolatedHeaderTranslation(0, 1),
          },
        ]}
      >
        <Header
          style={{ backgroundColor: 'blue' }}
          title={(organization || {}).name || '-'}
          left={<BackButton />}
        />
      </Animated.View>
    </Animated.View>
  );

  return (
    <ViewOverflow style={styles.containerLight}>
      <SafeAreaView style={{ backgroundColor: theme.primaryColor }} />
      <CollapsibleHeaderScrollView
        CollapsibleHeaderComponent={props => (
          <SafeAreaView style={{ flex: 1 }}>
            <Header2 {...props} />

            <CurrentTabHeader
              currentIndex={currentIndex}
              onChange={setCurrentIndex}
              tabs={tabs}
            />
          </SafeAreaView>
        )}
        headerHeight={250}
        statusBarHeight={100}
        headerContainerBackgroundColor={'white'}
      >
        {/* <CurrentTab tabs={tabs} initialTab={initialTab} params={{ orgId }} /> */}

        {/* {tabs[currentIndex].render(params)} */}
        <View style={{ height: 1000, backgroundColor: 'rgba(0, 0, 205, 0.2)' }}>
          <Text>Current Tab: {tabs[currentIndex].name}</Text>
        </View>
      </CollapsibleHeaderScrollView>
    </ViewOverflow>
  );
}

// export const generateParallaxTabMenuNavigator = (
//   // @ts-ignore
//   tabs,
// ) =>
//   createMaterialTopTabNavigator(
//     tabs.reduce(
//       // @ts-ignore
//       (acc, tab) => ({
//         ...acc,
//         [tab.navigationAction]: tab.component,
//       }),
//       {},
//     ),
//     {
//       backBehavior: 'none',
//       swipeEnabled: false,
//       lazy: true,
//       // zIndex keeps SwipeTabMenu blue arrow on top of tab view
//       tabBarComponent: ({ navigation }) => (
//         <ParallaxTabMenu navigation={navigation} tabs={tabs} />
//       ),
//     },
//   );

export const generateParallaxTabMenuNavigator = (
  // @ts-ignore
  tabs,
) => <ParallaxTabMenu tabs={tabs} />;
