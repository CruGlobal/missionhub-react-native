/* eslint max-params: 0, max-lines-per-function: 0 */

import React, { Component, ReactNode, ComponentType } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
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

import styles from './styles';

// @ts-ignore
@connect()
export class SwipeTabMenu extends Component<{
  tabs: { name: string; navigationAction: string }[];
  isLight?: boolean;
  navigation: {
    state: {
      index: number;
      params: { initialTab?: string };
    };
  };
}> {
  state = {
    // TODO: tab titles should be equidistant from each other, not equally sized
    maxMenuItemWidth: 1,
    previousIndex: 0,
  };
  scrollView = undefined;

  componentDidMount() {
    const {
      tabs,
      navigation: {
        state: {
          params: { initialTab },
        },
      },
    } = this.props;

    if (initialTab) {
      const initialIndex = tabs.findIndex(
        tab => tab.navigationAction === initialTab,
      );

      initialIndex !== -1 && this.navigateToTab(initialIndex);
    }
  }

  componentDidUpdate() {
    this.scrollToTab(this.props.navigation.state.index, false);
  }

  // Figure out width of largest text element in menu and make the rest the same size
  // TODO: figure out if there is a way to avoid flicker. Could hard code but that wouldn't work well with i18n
  onLayoutMenuItem = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    const { maxMenuItemWidth } = this.state;

    if (width > maxMenuItemWidth) {
      this.setState({
        maxMenuItemWidth: width,
      });
    }
  };

  onScrollFinishNavigate = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { x } = event.nativeEvent.contentOffset;
    const index = this.offsetToIndex(x);
    this.navigateToTab(index);
  };

  navigateToTab(index: number) {
    const {
      tabs,
      // @ts-ignore
      dispatch,
      navigation,
    } = this.props;

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

  scrollToTab = (index: number, navigate = true) => {
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

  offsetToIndex(x: number) {
    // Doing the math on Android doesn't result in integers so we round
    // Android isn't using contentInset so we don't have to account for it
    return Math.round(
      (x + (isAndroid ? 0 : this.getScrollInsetDistance())) /
        this.state.maxMenuItemWidth,
    );
  }

  indexToOffset(index: number) {
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
  tabs: {
    name: string;
    navigationAction: string;
    component: ReactNode;
  }[],
  HeaderComponent: ComponentType<{
    navigation: { state: { params: unknown } };
    isMember: boolean;
  }>,
  isMember: boolean,
  isLight: boolean,
) =>
  createMaterialTopTabNavigator(
    tabs.reduce(
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
      tabBarComponent: ({ navigation }) => (
        <>
          <HeaderComponent navigation={navigation} isMember={isMember} />
          <SwipeTabMenu navigation={navigation} tabs={tabs} isLight={isLight} />
        </>
      ),
    },
  );
