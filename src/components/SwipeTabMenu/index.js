import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { createMaterialTopTabNavigator } from 'react-navigation';
import ViewOverflow from 'react-native-view-overflow';

import { Flex } from '../common';
import { navigatePush } from '../../actions/navigation';
import { isAndroid } from '../../utils/common';

import styles from './styles';

@connect()
export class SwipeTabMenu extends Component {
  state = {
    maxMenuItemWidth: undefined,
    previousIndex: 0,
  };
  scrollView = undefined;

  componentDidUpdate() {
    this.scrollToTab(this.props.navigation.state.index, false);
  }

  // Figure out width of largest text element in menu and make the rest the same size
  // TODO: figure out if there is a way to avoid flicker. Could hard code but that wouldn't work well with i18n
  onLayoutMenuItem = event => {
    const { width } = event.nativeEvent.layout;
    const { maxMenuItemWidth } = this.state;

    if (!maxMenuItemWidth || width > maxMenuItemWidth) {
      this.setState({
        maxMenuItemWidth: width,
      });
    }
  };

  onScrollFinishNavigate = event => {
    const { x } = event.nativeEvent.contentOffset;
    const index = this.offsetToIndex(x);
    this.navigateToTab(index);
  };

  navigateToTab(index) {
    const { tabs, dispatch, navigation } = this.props;

    if (index !== navigation.state.index) {
      dispatch(navigatePush(tabs[index].navigationAction));
    }

    this.setState({
      previousIndex: index,
    });
  }

  scrollToTab = (index, navigate = true) => {
    this.scrollView &&
      this.scrollView.scrollTo({
        x: this.indexToOffset(index),
        y: 0,
        animated: true,
      });

    // Android doesn't call onMomentumScrollEnd when manually scrolling
    navigate && isAndroid && this.navigateToTab(index);
  };

  offsetToIndex(x) {
    // Doing the math on Android doesn't result in integers so we round
    // Android isn't using contentInset so we don't have to account for it
    return Math.round(
      (x + (isAndroid ? 0 : this.getScrollInsetDistance())) /
        this.state.maxMenuItemWidth,
    );
  }

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

  render() {
    const { tabs, navigation } = this.props;
    const { maxMenuItemWidth, previousIndex } = this.state;
    const insetDistance = this.getScrollInsetDistance();
    const currentIndex = navigation.state.index;

    return (
      <ViewOverflow style={styles.container}>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
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
            <TouchableWithoutFeedback
              key={tab.navigationAction}
              onPress={() => this.scrollToTab(index)}
              onLayout={this.onLayoutMenuItem}
            >
              <View
                style={[
                  styles.menuItem,
                  { width: this.state.maxMenuItemWidth },
                ]}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    index === currentIndex && styles.menuItemTextActive,
                  ]}
                >
                  {tab.name}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
        <Flex align={'center'} style={styles.triangleContainer}>
          <View style={styles.triangle} />
        </Flex>
      </ViewOverflow>
    );
  }
}

export const generateSwipeTabMenuNavigator = (tabs, HeaderComponent) =>
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
      // zIndex keeps SwipeTabMenu blue arrow on top of tab view
      tabBarComponent: ({ navigation }) => (
        <ViewOverflow style={{ zIndex: 100 }}>
          <HeaderComponent navigation={navigation} />
          <SwipeTabMenu navigation={navigation} tabs={tabs} />
        </ViewOverflow>
      ),
    },
  );
