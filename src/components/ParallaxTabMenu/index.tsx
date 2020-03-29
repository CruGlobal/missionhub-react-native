/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint max-params: 0, max-lines-per-function: 0 */

import React, { Component, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/named
// import { NavigationActions } from 'react-navigation';
// import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// import {
//   CollapsibleHeaderScrollView,
//   CollapsibleHeaderProps,
// } from 'react-native-collapsible-header-views';
// @ts-ignore
import ViewOverflow from 'react-native-view-overflow';
// eslint-disable-next-line import/default
// import ParallaxScrollView from 'react-native-parallax-scroll-view';
// @ts-ignore
import { useNavigationParam } from 'react-navigation-hooks';
// @ts-ignore
// import StickyParallaxHeader from 'react-native-sticky-parallax-header';

import { Flex, Touchable } from '../common';
import { isAndroid, orgIsGlobal } from '../../utils/common';
import Header from '../Header';
import Icon from '../Icon';
import Button from '../Button';
import BackButton from '../../containers/BackButton';
import theme from '../../theme';
import { OrganizationsState, Organization } from '../../reducers/organizations';
import { organizationSelector } from '../../selectors/organizations';
import DEFAULT_MISSIONHUB_IMAGE from '../../../assets/images/impactBackground.png';
import GLOBAL_COMMUNITY_IMAGE from '../../../assets/images/globalCommunityImage.png';

import styles from './styles';
import ReactNativeParallaxHeader from './CustomParallax';
// import ParallaxScrollView from './CustomParallax2';
// import ParallaxScrollView from './Custom';

const CurrentTabHeader = React.memo(({ tabs, currentIndex, onChange }: any) => {
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{
        flex: 1,
        height: 50,
        backgroundColor: theme.white,
        // position: 'absolute',
        // left: 0,
        // right: 0,
        // top: 100,
      }}
    >
      {tabs.map((tab: any, index: number) => (
        <Touchable
          key={tab.navigationAction}
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

  let bgSource: any;
  if (organization.community_photo_url) {
    bgSource = { uri: organization.community_photo_url };
  } else if (orgIsGlobal(organization)) {
    bgSource = GLOBAL_COMMUNITY_IMAGE;
  } else {
    bgSource = DEFAULT_MISSIONHUB_IMAGE;
  }

  return (
    <ViewOverflow style={styles.containerLight}>
      <StatusBar {...theme.statusBar.darkContent} />
      <SafeAreaView style={{ backgroundColor: theme.white }} />

      <ReactNativeParallaxHeader
        headerMinHeight={theme.headerHeight}
        headerMaxHeight={225}
        navbarColor={theme.white}
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        backgroundImage={bgSource}
        backgroundImageScale={1.2}
        headerTitleStyle={{
          paddingTop: 0,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
        title={
          <>
            <View
              style={{
                height: theme.headerHeight,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Flex value={1} align="center">
                <BackButton />
              </Flex>
              <Flex value={5} />
              <Flex value={1} align="center">
                <Icon
                  type="MissionHub"
                  name="stepsIcon"
                  size={16}
                  style={{ color: theme.white }}
                />
              </Flex>
            </View>
            <Flex
              justify="end"
              style={{
                paddingTop: 25,
                paddingLeft: 25,
                paddingRight: 100,
              }}
            >
              <Text style={styles.orgName} numberOfLines={2}>
                {(organization || {}).name || '-'}
              </Text>
              <Flex direction="row" align="start">
                <Button
                  pill={true}
                  type="transparent"
                  onPress={() => {}}
                  style={styles.orgMembersButton}
                  buttonTextStyle={styles.orgMembersText}
                  text="24 Members"
                />
              </Flex>
            </Flex>
          </>
        }
        renderNavBar={(opacity: any) => (
          <SafeAreaView style={{ marginHorizontal: 0 }}>
            <Animated.View
              style={{
                height: theme.headerHeight,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.white,
                borderBottomWidth: 1,
                borderBottomColor: theme.grey1,
                opacity,
              }}
            >
              <Flex value={1} align="center">
                <BackButton iconStyle={{ color: theme.textColor }} />
              </Flex>
              <Flex value={5} align="center" justify="center">
                <Animated.View style={{ opacity }}>
                  <Text style={styles.orgNameHeader}>
                    {(organization || {}).name || '-'}
                  </Text>
                </Animated.View>
              </Flex>
              <Flex value={1} align="center">
                <Icon
                  type="MissionHub"
                  name="stepsIcon"
                  size={16}
                  style={{ color: theme.textColor }}
                />
              </Flex>
            </Animated.View>
          </SafeAreaView>
        )}
        scrollViewStyle={{ flex: 1, width: '100%' }}
        containerStyle={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollViewProps={{ stickyHeaderIndices: [1] }}
      >
        <View style={[{ marginTop: 225 - theme.headerHeight }]} />

        <View style={{ paddingTop: theme.headerHeight }}>
          <CurrentTabHeader
            currentIndex={currentIndex}
            onChange={setCurrentIndex}
            tabs={tabs}
          />
        </View>
        {tabs[currentIndex].render({ orgId })}
      </ReactNativeParallaxHeader>
      {/* <CollapsibleHeaderScrollView
        CollapsibleHeaderComponent={props => (
          <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.primaryColor }}
          >
            <Header2 {...props} />
          </SafeAreaView>
        )}
        stickyHeaderIndices={[1]}
        headerHeight={theme.headerHeight}
        disableHeaderSnap={false}
        contentContainerStyle={{ paddingTop: theme.headerHeight }}
        headerContainerBackgroundColor={'white'}
      >
        <View style={{ backgroundColor: theme.white }}>
          <Image source={bgSource} style={{ width: '100%' }} />
        </View>
        <View style={{ backgroundColor: theme.white }}>
          <CurrentTabHeader
            currentIndex={currentIndex}
            onChange={setCurrentIndex}
            tabs={tabs}
          />
        </View>

        <View style={{ height: 1000, backgroundColor: 'rgba(0, 0, 205, 0.2)' }}>
          <Text>Current Tab: {tabs[currentIndex].name}</Text>
        </View>
      </CollapsibleHeaderScrollView> */}
      {/* <ParallaxScrollView
        parallaxHeaderHeight={50}
        stickyHeaderHeight={10}
        renderStickyHeader={() => (
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'orange',
            }}
          >
            <Text
              style={[styles.orgName, { color: 'green' }]}
              numberOfLines={2}
            >
              {(organization || {}).name || '-'}f dsa fas
            </Text>
          </View>
        )}
        fadeOutBackground={true}
        fadeOutForeground={true}
        renderBackground={() => (
          <View
            style={[
              // styles.parallaxContent,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: theme.fullWidth,
                backgroundColor: 'green',
              },
            ]}
          >
            <Image source={bgSource} style={{ width: '100%' }} />
          </View>
        )}
        renderForeground={() => (
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[styles.orgName, { color: 'blue' }]} numberOfLines={2}>
              {(organization || {}).name || '-'}
            </Text>
            <Text style={{ color: 'blue' }}>24 members</Text>
          </View>
        )}
        stickyHeaderIndices={[1]}
      >
        <CurrentTabHeader
          currentIndex={currentIndex}
          onChange={setCurrentIndex}
          tabs={tabs}
        />
      </ParallaxScrollView> */}
      {/* <ParallaxScrollView
        bgSource={bgSource}
        sticky={() => (
          <CurrentTabHeader
            currentIndex={currentIndex}
            onChange={setCurrentIndex}
            tabs={tabs}
          />
        )}
      >
        <View style={{ height: 1000, backgroundColor: 'orange' }} />
      </ParallaxScrollView> */}

      {/* <TabScreen tabs={tabs} bgSource={bgSource} organization={organization} /> */}
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

// const customStyles = StyleSheet.create({
//   content: {
//     height: 1000,
//   },
//   message: {
//     color: 'white',
//     fontSize: 40,
//     paddingTop: 24,
//     paddingBottom: 7,
//   },
//   tabsWrapper: {
//     paddingVertical: 0,
//     paddingHorizontal: 0,
//   },
//   tabTextContainerStyle: {
//     width: 125,
//     backgroundColor: theme.transparent,
//   },
//   tabTextContainerActiveStyle: {
//     borderBottomColor: theme.challengeBlue,
//     borderBottomWidth: 2,
//   },
//   tabText: {
//     fontSize: 16,
//     lineHeight: 20,
//     textAlign: 'center',
//     paddingVertical: 8,
//     color: theme.textColor,
//   },
//   tabActiveText: {
//     color: theme.challengeBlue,
//   },
// });

// class TabScreen extends React.Component {
//   state = {
//     scroll: new Animated.Value(0),
//   };
//   _value = 0;

//   componentDidMount() {
//     const { scroll } = this.state;
//     scroll.addListener(({ value }) => (this._value = value));
//   }

//   // renderContent = (label: string) => (
//   //   <View style={customStyles.content}>
//   //     <Text>{label}</Text>
//   //   </View>
//   // );
//   renderContent2 = (tab: any) =>
//     tab.render({ orgId: this.props.organization.id });

//   renderForeground = () => {
//     const { organization } = this.props;
//     const { scroll } = this.state;
//     const imageOpacity = scroll.interpolate({
//       inputRange: [0, 106, 200],
//       outputRange: [1, 0.7, 0],
//       extrapolate: 'clamp',
//     });
//     const titleOpacity = scroll.interpolate({
//       inputRange: [0, 55, 125],
//       outputRange: [1, 0.8, 0],
//       extrapolate: 'clamp',
//     });

//     return (
//       <View
//         style={[
//           {
//             height: 200,
//             padding: 0,
//             margin: 0,
//             position: 'relative',
//             marginBottom: -25,
//             paddingBottom: -25,
//             backgroundColor: 'rgba(0, 0, 0, 0.15)',
//           },
//         ]}
//       >
//         <Animated.View style={{ opacity: imageOpacity }}>
//           <Image
//             source={this.props.bgSource}
//             style={{ width: '100%' }}
//             resizeMode="cover"
//           />
//         </Animated.View>
//         <Animated.View
//           style={{
//             opacity: titleOpacity,
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             marginBottom: 25,
//             marginLeft: 25,
//             marginRight: 100,
//           }}
//         >
//           <Flex justify="end" style={{ height: '100%' }}>
//             <Text style={styles.orgName} numberOfLines={2}>
//               {(organization || {}).name || '-'}
//             </Text>
//             <Flex direction="row" align="start">
//               <Button
//                 pill={true}
//                 type="transparent"
//                 onPress={() => {}}
//                 style={styles.orgMembersButton}
//                 buttonTextStyle={styles.orgMembersText}
//                 text="24 Members"
//               />
//             </Flex>
//           </Flex>
//         </Animated.View>
//       </View>
//     );
//   };

//   renderHeader = () => {
//     const { organization } = this.props;
//     const { scroll } = this.state;
//     const opacity = scroll.interpolate({
//       inputRange: [0, 55, 125],
//       outputRange: [0, 0.2, 1],
//       extrapolate: 'clamp',
//     });
//     // const bgColor = scroll.interpolate({
//     //   inputRange: [0, 150],
//     //   outputRange: ['rgba(0, 0, 0, 0)', 'rgba(75, 75, 75, 1)'],
//     //   extrapolate: 'clamp',
//     // });

//     return (
//       <View
//         style={{
//           backgroundColor: theme.transparent,
//           width: theme.fullWidth,
//           height: theme.headerHeight,
//         }}
//       >
//         <Animated.View
//           style={{
//             height: theme.headerHeight,
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: theme.primaryColor,
//             // backgroundColor: bgColor,
//           }}
//         >
//           <Flex value={1} align="center">
//             <BackButton />
//           </Flex>
//           <Flex value={5} align="center" justify="center">
//             <Animated.View style={{ opacity }}>
//               <Text style={styles.orgNameHeader}>
//                 {(organization || {}).name || '-'}
//               </Text>
//             </Animated.View>
//           </Flex>
//           <Flex value={1} align="center">
//             <Icon type="MissionHub" name="stepsIcon" size={16} style={{}} />
//           </Flex>
//         </Animated.View>
//       </View>
//     );
//   };

//   render() {
//     const { tabs, organization } = this.props;
//     const { scroll } = this.state;

//     return (
//       <>
//         <StickyParallaxHeader
//           foreground={this.renderForeground()}
//           parallaxHeight={225}
//           header={this.renderHeader()}
//           headerHeight={Math.max(this._value, theme.headerHeight)}
//           headerSize={() => {}}
//           onEndReached={() => {}}
//           scrollEvent={Animated.event([
//             { nativeEvent: { contentOffset: { y: scroll } } },
//           ])}
//           tabs={tabs.map((t: any) => ({
//             title: t.name,
//             content: this.renderContent2(t),
//           }))}
//           // tabs={[
//           //   {
//           //     title: 'First Tab',
//           //     content: this.renderContent('FIRST TAB'),
//           //   },
//           //   {
//           //     title: 'Second Tab',
//           //     content: this.renderContent('SECOND TAB'),
//           //   },
//           //   {
//           //     title: 'Third Tab',
//           //     content: this.renderContent('THIRD TAB'),
//           //   },
//           //   {
//           //     title: 'Fourth Tab',
//           //     content: this.renderContent('FOURTH TAB'),
//           //   },
//           //   {
//           //     title: 'Fifth Tab',
//           //     content: this.renderContent('FIFTH TAB'),
//           //   },
//           // ]}
//           tabTextStyle={customStyles.tabText}
//           tabTextActiveStyle={[
//             customStyles.tabText,
//             customStyles.tabActiveText,
//           ]}
//           tabTextContainerStyle={customStyles.tabTextContainerStyle}
//           tabTextContainerActiveStyle={customStyles.tabTextContainerActiveStyle}
//           tabsWrapperStyle={customStyles.tabsWrapper}
//           tabsContainerBackgroundColor={'white'}
//         ></StickyParallaxHeader>
//       </>
//     );
//   }
// }
// class TabScreen2 extends React.Component {
//   state = {
//     scroll: new Animated.Value(0),
//   };
//   renderContent2 = (tab: any) =>
//     tab.render({ orgId: this.props.organization.id });

//   renderForeground = () => {
//     const { organization } = this.props;
//     const { scroll } = this.state;
//     const imageOpacity = scroll.interpolate({
//       inputRange: [0, 106, 200],
//       outputRange: [1, 0.7, 0],
//       extrapolate: 'clamp',
//     });
//     const titleOpacity = scroll.interpolate({
//       inputRange: [0, 55, 125],
//       outputRange: [1, 0.8, 0],
//       extrapolate: 'clamp',
//     });

//     return (
//       <View
//         style={[
//           {
//             height: 200,
//             padding: 0,
//             margin: 0,
//             position: 'relative',
//             marginBottom: -25,
//             paddingBottom: -25,
//             backgroundColor: 'rgba(0, 0, 0, 0.15)',
//           },
//         ]}
//       >
//         <Animated.View style={{ opacity: imageOpacity }}>
//           <Image
//             source={this.props.bgSource}
//             style={{ width: '100%' }}
//             resizeMode="cover"
//           />
//         </Animated.View>
//         <Animated.View
//           style={{
//             opacity: titleOpacity,
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             marginBottom: 25,
//             marginLeft: 25,
//             marginRight: 100,
//           }}
//         >
//           <Flex justify="end" style={{ height: '100%' }}>
//             <Text style={styles.orgName} numberOfLines={2}>
//               {(organization || {}).name || '-'}
//             </Text>
//             <Flex direction="row" align="start">
//               <Button
//                 pill={true}
//                 type="transparent"
//                 onPress={() => {}}
//                 style={styles.orgMembersButton}
//                 buttonTextStyle={styles.orgMembersText}
//                 text="24 Members"
//               />
//             </Flex>
//           </Flex>
//         </Animated.View>
//       </View>
//     );
//   };

//   renderHeader = () => {
//     const { organization } = this.props;
//     const { scroll } = this.state;
//     const opacity = scroll.interpolate({
//       inputRange: [0, 55, 125],
//       outputRange: [0, 0.2, 1],
//       extrapolate: 'clamp',
//     });
//     // const bgColor = scroll.interpolate({
//     //   inputRange: [0, 150],
//     //   outputRange: ['rgba(0, 0, 0, 0)', 'rgba(75, 75, 75, 1)'],
//     //   extrapolate: 'clamp',
//     // });

//     return (
//       <View
//         style={{
//           backgroundColor: theme.transparent,
//           width: theme.fullWidth,
//           height: theme.headerHeight,
//         }}
//       >
//         <Animated.View
//           style={{
//             height: theme.headerHeight,
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: theme.primaryColor,
//             // backgroundColor: bgColor,
//           }}
//         >
//           <Flex value={1} align="center">
//             <BackButton />
//           </Flex>
//           <Flex value={5} align="center" justify="center">
//             <Animated.View style={{ opacity }}>
//               <Text style={styles.orgNameHeader}>
//                 {(organization || {}).name || '-'}
//               </Text>
//             </Animated.View>
//           </Flex>
//           <Flex value={1} align="center">
//             <Icon type="MissionHub" name="stepsIcon" size={16} style={{}} />
//           </Flex>
//         </Animated.View>
//       </View>
//     );
//   };

//   render() {
//     const { tabs, organization } = this.props;
//     const { scroll } = this.state;

//     return (
//       <>
//         <StickyParallaxHeader
//           foreground={this.renderForeground()}
//           parallaxHeight={225}
//           header={this.renderHeader()}
//           headerHeight={Math.max(this._value, theme.headerHeight)}
//           headerSize={() => {}}
//           onEndReached={() => {}}
//           scrollEvent={Animated.event([
//             { nativeEvent: { contentOffset: { y: scroll } } },
//           ])}
//           tabs={tabs.map((t: any) => ({
//             title: t.name,
//             content: this.renderContent2(t),
//           }))}
//           // tabs={[
//           //   {
//           //     title: 'First Tab',
//           //     content: this.renderContent('FIRST TAB'),
//           //   },
//           //   {
//           //     title: 'Second Tab',
//           //     content: this.renderContent('SECOND TAB'),
//           //   },
//           //   {
//           //     title: 'Third Tab',
//           //     content: this.renderContent('THIRD TAB'),
//           //   },
//           //   {
//           //     title: 'Fourth Tab',
//           //     content: this.renderContent('FOURTH TAB'),
//           //   },
//           //   {
//           //     title: 'Fifth Tab',
//           //     content: this.renderContent('FIFTH TAB'),
//           //   },
//           // ]}
//           tabTextStyle={customStyles.tabText}
//           tabTextActiveStyle={[
//             customStyles.tabText,
//             customStyles.tabActiveText,
//           ]}
//           tabTextContainerStyle={customStyles.tabTextContainerStyle}
//           tabTextContainerActiveStyle={customStyles.tabTextContainerActiveStyle}
//           tabsWrapperStyle={customStyles.tabsWrapper}
//           tabsContainerBackgroundColor={'white'}
//         ></StickyParallaxHeader>
//       </>
//     );
//   }
// }
