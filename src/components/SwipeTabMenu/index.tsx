/* eslint max-params: 0, max-lines-per-function: 0 */

import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux-legacy';
// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// @ts-ignore
import ViewOverflow from 'react-native-view-overflow';

import { Touchable } from '../common';
import { isAndroid } from '../../utils/common';
import { TriangleIndicator } from '../TriangleIndicator/TriangleIndicator';
import theme from '../../theme';
import { CommunityHeader } from '../../containers/Communities/Community/CommunityHeader/CommunityHeader';

import styles from './styles';

// @ts-ignore
@connect()
export class SwipeTabMenu extends Component {
  state = {
    // TODO: tab titles should be equidistant from each other, not equally sized
    maxMenuItemWidth: 1,
    previousIndex: 0,
  };
  scrollView = undefined;

  componentDidMount() {
    const {
      // @ts-ignore
      tabs,
      // @ts-ignore
      navigation: {
        state: {
          params: { initialTab },
        },
      },
    } = this.props;

    if (initialTab) {
      const initialIndex = tabs.findIndex(
        // @ts-ignore
        tab => tab.navigationAction === initialTab,
      );

      initialIndex !== -1 && this.navigateToTab(initialIndex);
    }
  }

  componentDidUpdate() {
    // @ts-ignore
    this.scrollToTab(this.props.navigation.state.index, false);
  }

  // Figure out width of largest text element in menu and make the rest the same size
  // TODO: figure out if there is a way to avoid flicker. Could hard code but that wouldn't work well with i18n
  // @ts-ignore
  onLayoutMenuItem = event => {
    const { width } = event.nativeEvent.layout;
    const { maxMenuItemWidth } = this.state;

    if (width > maxMenuItemWidth) {
      this.setState({
        maxMenuItemWidth: width,
      });
    }
  };

  // @ts-ignore
  onScrollFinishNavigate = event => {
    const { x } = event.nativeEvent.contentOffset;
    const index = this.offsetToIndex(x);
    this.navigateToTab(index);
  };

  // @ts-ignore
  navigateToTab(index) {
    // @ts-ignore
    const { tabs, dispatch, navigation } = this.props;

    if (index !== navigation.state.index && tabs[index]) {
      dispatch(
        NavigationActions.navigate({
          routeName: tabs[index].navigationAction,
          params: {},
        }),
      );
    }

    this.setState({
      previousIndex: index,
    });
  }

  // @ts-ignore
  scrollToTab = (index, navigate = true) => {
    this.scrollView &&
      // @ts-ignore
      this.scrollView.scrollTo({
        x: this.indexToOffset(index),
        y: 0,
        animated: true,
      });

    // Android doesn't call onMomentumScrollEnd when manually scrolling
    navigate && isAndroid && this.navigateToTab(index);
  };

  // @ts-ignore
  offsetToIndex(x) {
    // Doing the math on Android doesn't result in integers so we round
    // Android isn't using contentInset so we don't have to account for it
    return Math.round(
      (x + (isAndroid ? 0 : this.getScrollInsetDistance())) /
        this.state.maxMenuItemWidth,
    );
  }

  // @ts-ignore
  indexToOffset(index) {
    return (
      index * this.state.maxMenuItemWidth -
      (isAndroid ? 0 : this.getScrollInsetDistance())
    );
  }

  getScrollInsetDistance() {
    const { maxMenuItemWidth } = this.state;
    const { width } = Dimensions.get('window');
    return width / 2 - maxMenuItemWidth / 2;
  }

  // @ts-ignore
  ref = ref => (this.scrollView = ref);

  render() {
    // @ts-ignore
    const { tabs, navigation, isLight } = this.props;
    const { maxMenuItemWidth, previousIndex } = this.state;
    const insetDistance = this.getScrollInsetDistance();
    const currentIndex = navigation.state.index;

    return (
      <ViewOverflow style={isLight ? styles.containerLight : styles.container}>
        <ScrollView
          ref={this.ref}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentInset={{
            left: insetDistance,
            right: insetDistance,
            top: 0,
            bottom: 0,
          }}
          contentOffset={{ x: this.indexToOffset(previousIndex) || 0, y: 0 }}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={[
            styles.scrollContainer,
            isAndroid && { paddingHorizontal: insetDistance }, // Use padding instead of contentInset since it isn't supported on Android
          ]}
          snapToAlignment={'center'}
          snapToInterval={maxMenuItemWidth}
          decelerationRate={'fast'}
          onMomentumScrollEnd={this.onScrollFinishNavigate}
        >
          {/* 
          // @ts-ignore */}
          {tabs.map((tab, index) => (
            <Touchable
              key={tab.navigationAction}
              withoutFeedback={true}
              pressProps={[index]}
              onPress={this.scrollToTab}
              onLayout={this.onLayoutMenuItem}
            >
              <View
                style={[
                  styles.menuItem,
                  this.state.maxMenuItemWidth === 1
                    ? null
                    : { width: this.state.maxMenuItemWidth },
                ]}
              >
                <Text
                  style={
                    index === currentIndex
                      ? isLight
                        ? styles.menuItemTextActiveLight
                        : styles.menuItemTextActive
                      : isLight
                      ? styles.menuItemTextLight
                      : styles.menuItemText
                  }
                >
                  {tab.name}
                </Text>
              </View>
            </Touchable>
          ))}
        </ScrollView>
        <View style={styles.triangleIndicatorContainer}>
          <TriangleIndicator
            color={isLight ? theme.extraLightGrey : theme.accentColor}
            rotation={180}
          />
        </View>
      </ViewOverflow>
    );
  }
}

export const generateSwipeTabMenuNavigator = (
  // @ts-ignore
  tabs,
  // @ts-ignore
  HeaderComponent,
  // @ts-ignore
  isMember,
  // @ts-ignore
  isLight,
) =>
  createMaterialTopTabNavigator(
    tabs.reduce(
      // @ts-ignore
      (acc, tab) => ({
        ...acc,
        [tab.navigationAction]: tab.component,
      }),
      {},
    ),
    {
      backBehavior: 'none',
      swipeEnabled: false,
      lazy: true,
      // zIndex keeps SwipeTabMenu blue arrow on top of tab view
      tabBarComponent: ({ navigation }) =>
        <CommunityHeader communityId={navigation.state.params.orgId} /> || (
          <>
            <HeaderComponent navigation={navigation} isMember={isMember} />
            {/*
          // @ts-ignore */}
            <SwipeTabMenu
              navigation={navigation}
              tabs={tabs}
              isLight={isLight}
            />
          </>
        ),
    },
  );
