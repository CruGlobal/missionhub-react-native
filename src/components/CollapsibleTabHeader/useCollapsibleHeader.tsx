/* eslint-disable max-lines */

import React, { useEffect, useState, useRef } from 'react';
import memoize from 'fast-memoize';
import {
  ScrollView,
  ScrollViewProps,
  View,
  ViewStyle,
  StyleSheet,
  Animated,
} from 'react-native';

import { Text } from '../common';

export type AnimationConfig = { animated?: boolean };

export type CollapsibleHeaderProps = {
  interpolatedHeaderTranslation: (
    from: number,
    to: number,
  ) => Animated.AnimatedInterpolation;
  showHeader: (options: AnimationConfig | unknown) => void;
  hideHeader: (options: AnimationConfig | unknown) => void;
};

export type CollapsibleHeaderViewProps<T extends ScrollViewProps> = T & {
  readonly headerHeight: number;
  readonly statusBarHeight?: number;
  readonly disableHeaderSnap?: boolean;
  readonly headerAnimationDuration?: number;
  readonly clipHeader?: boolean;
};

interface CollapsibleHeaderViewStyle {
  readonly fill: ViewStyle;
  readonly header: ViewStyle;
  readonly container: ViewStyle;
}

export const useCollapsibleHeader = ({
  headerHeight,
  statusBarHeight = 0,
  clipHeader = false,
  disableHeaderSnap = false,
  headerAnimationDuration = 350,
}: CollapsibleHeaderViewProps<ScrollViewProps>) => {
  const getClampedScrollAnimation = (
    headerHeight: number,
    statusBarHeight: number,
  ) =>
    Animated.diffClamp(
      Animated.add(
        scrollAnim.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolateLeft: 'clamp',
        }),
        offsetAnim.current,
      ),
      0,
      headerHeight - statusBarHeight,
    );

  const getHeaderTranslationAnimation = (
    headerHeight: number,
    statusBarHeight: number,
  ) =>
    clampedScroll.current.interpolate({
      inputRange: [0, headerHeight - statusBarHeight],
      outputRange: [0, -(headerHeight - statusBarHeight)],
      extrapolate: 'clamp',
    });

  const scrollAnim = useRef(new Animated.Value(0));
  const offsetAnim = useRef(new Animated.Value(0));
  const clampedScroll = useRef<Animated.AnimatedDiffClamp>(
    getClampedScrollAnimation(headerHeight, statusBarHeight),
  );
  const scrollValue = useRef(0);
  const offsetValue = useRef(0);
  const clampedScrollValue = useRef(0);
  const scrollEndTimer = useRef<NodeJS.Timer>(0);
  const headerSnap = useRef<Animated.CompositeAnimation>();
  const headerTranslation = useRef<Animated.AnimatedInterpolation>(
    getHeaderTranslationAnimation(headerHeight, statusBarHeight),
  );

  useEffect(() => {
    initAnimations(headerHeight, statusBarHeight);
    return () => cleanupAnimations();
  }, [headerHeight, statusBarHeight]);

  const initAnimations = (headerHeight: number, statusBarHeight: number) => {
    scrollAnim.current.addListener(({ value }) => {
      const diff = value - scrollValue.current;
      scrollValue.current = value;
      clampedScrollValue.current = Math.min(
        Math.max(clampedScrollValue.current + diff, 0),
        headerHeight - statusBarHeight,
      );
    });

    offsetAnim.current.addListener(({ value }) => {
      offsetValue.current = value;
    });

    clampedScroll.current = getClampedScrollAnimation(
      headerHeight,
      statusBarHeight,
    );
    headerTranslation.current = getHeaderTranslationAnimation(
      headerHeight,
      statusBarHeight,
    );
  };

  const cleanupAnimations = () => {
    scrollAnim.current.removeAllListeners();
    offsetAnim.current.removeAllListeners();
    clearTimeout(scrollEndTimer.current);

    if (headerSnap.current) {
      headerSnap.current.stop();
    }
  };

  const onScrollEndDrag = () => {
    if (!disableHeaderSnap) {
      scrollEndTimer.current = setTimeout(onMomentumScrollEnd, 250);
    }
  };

  const onMomentumScrollBegin = () => {
    if (!disableHeaderSnap) {
      clearTimeout(scrollEndTimer.current);
    }
  };

  const onMomentumScrollEnd = () => {
    if (!disableHeaderSnap) {
      moveHeader(
        scrollValue.current > headerHeight &&
          clampedScrollValue.current > (headerHeight - statusBarHeight) / 2
          ? offsetValue.current + headerHeight
          : offsetValue.current - headerHeight,
      );
    }
  };

  const interpolatedHeaderTranslation = (from: number, to: number) => {
    return clampedScroll.current.interpolate({
      inputRange: [0, headerHeight - statusBarHeight],
      outputRange: [from, to],
      extrapolate: 'clamp',
    });
  };

  const isAnimationConfig = (options: AnimationConfig | unknown): boolean => {
    return options && (options as AnimationConfig).animated !== undefined;
  };

  const showHeader = (options: AnimationConfig | unknown) => {
    moveHeader(
      offsetValue.current - headerHeight,
      !isAnimationConfig(options) || (options as AnimationConfig).animated,
    );
  };

  const hideHeader = (options: AnimationConfig | unknown) => {
    moveHeader(
      offsetValue.current +
        (scrollValue.current > headerHeight
          ? headerHeight
          : scrollValue.current),
      !isAnimationConfig(options) || (options as AnimationConfig).animated,
    );
  };

  const moveHeader = (toValue: number, animated = true) => {
    if (headerSnap.current) {
      headerSnap.current.stop();
    }

    if (animated) {
      headerSnap.current = Animated.timing(offsetAnim.current, {
        toValue,
        duration: headerAnimationDuration,
        useNativeDriver: true,
      });

      headerSnap.current.start();
    } else {
      offsetAnim.current.setValue(toValue);
    }
  };

  const styles = style(headerHeight, statusBarHeight, clipHeader);

  const headerProps = {
    interpolatedHeaderTranslation: interpolatedHeaderTranslation,
    showHeader: showHeader,
    hideHeader: hideHeader,
    style: [
      styles.header,
      [{ transform: [{ translateY: headerTranslation.current }] }],
    ],
  };

  const collapsibleScrollViewProps = {
    bounces: false,
    overScrollMode: 'never' as ScrollViewProps[keyof ScrollViewProps['overScrollMode']],
    scrollEventThrottle: 1,
    contentContainerStyle: styles.container,
    onMomentumScrollBegin: onMomentumScrollBegin,
    onMomentumScrollEnd: onMomentumScrollEnd,
    onScrollEndDrag: onScrollEndDrag,
    onScroll: Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollAnim.current } } }],
      { useNativeDriver: true },
    ),
  };

  return {
    collapsibleHeaderProps: headerProps,
    collapsibleScrollViewProps,
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// export const withCollapsibleHeader = <T extends ScrollViewProps>(
//   Component: React.ComponentClass<T>,
// ) => {
//   const AnimatedComponent = Animated.createAnimatedComponent(
//     Component,
//   ) as React.ComponentClass<ScrollViewProps>;

//   return class CollapsibleHeaderView extends React.Component<
//     CollapsibleHeaderViewProps<T>
//   > {
//     static defaultProps = {
//       statusBarHeight: 0,
//       disableHeaderMomentum: false,
//       headerMomentumDuration: 350,
//       headerContainerBackgroundColor: 'white',
//     };

//     private scrollAnim = new Animated.Value(0);
//     private offsetAnim = new Animated.Value(0);
//     private clampedScroll?: Animated.AnimatedDiffClamp;
//     private scrollValue = 0;
//     private offsetValue = 0;
//     private clampedScrollValue = 0;
//     private scrollEndTimer = 0;
//     private headerSnap?: Animated.CompositeAnimation;
//     private headerTranslation?: Animated.AnimatedInterpolation;
//     private currentHeaderHeight?: number;
//     private currentStatusBarHeight?: number;
//     private wrappedComponent: React.RefObject<any> = React.createRef();

//     public constructor(props: CollapsibleHeaderViewProps<T>) {
//       super(props);

//       const { headerHeight, statusBarHeight } = props;

//       this.initAnimations(headerHeight, statusBarHeight);
//     }

//     private initAnimations(headerHeight: number, statusBarHeight: number) {
//       this.scrollAnim.addListener(({ value }) => {
//         const diff = value - this.scrollValue;
//         this.scrollValue = value;
//         this.clampedScrollValue = Math.min(
//           Math.max(this.clampedScrollValue + diff, 0),
//           headerHeight - statusBarHeight,
//         );
//       });

//       this.offsetAnim.addListener(({ value }) => {
//         this.offsetValue = value;
//       });

//       this.clampedScroll = Animated.diffClamp(
//         Animated.add(
//           this.scrollAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [0, 1],
//             extrapolateLeft: 'clamp',
//           }),
//           this.offsetAnim,
//         ),
//         0,
//         headerHeight - statusBarHeight,
//       );

//       this.headerTranslation = this.clampedScroll.interpolate({
//         inputRange: [0, headerHeight - statusBarHeight],
//         outputRange: [0, -(headerHeight - statusBarHeight)],
//         extrapolate: 'clamp',
//       });

//       this.currentHeaderHeight = headerHeight;
//       this.currentStatusBarHeight = statusBarHeight;
//     }

//     private cleanupAnimations() {
//       this.scrollAnim.removeAllListeners();
//       this.offsetAnim.removeAllListeners();
//       clearTimeout(this.scrollEndTimer);

//       if (this.headerSnap) {
//         this.headerSnap.stop();
//       }
//     }

//     private resetAnimations(headerHeight: number, statusBarHeight: number) {
//       if (
//         this.currentHeaderHeight !== headerHeight ||
//         this.currentStatusBarHeight !== statusBarHeight
//       ) {
//         this.cleanupAnimations();
//         this.initAnimations(headerHeight, statusBarHeight);
//       }
//     }

//     public componentWillUnmount() {
//       this.cleanupAnimations();
//     }

//     public render() {
//       const {
//         statusBarHeight,
//         CollapsibleHeaderComponent,
//         contentContainerStyle,
//         headerHeight,
//         onScroll,
//         headerContainerBackgroundColor,
//         clipHeader,
//         ...props
//       } = this.props as CollapsibleHeaderViewProps<ScrollViewProps>;

//       this.resetAnimations(headerHeight, statusBarHeight);

//       const headerProps = {
//         interpolatedHeaderTranslation: this.interpolatedHeaderTranslation,
//         showHeader: this.showHeader,
//         hideHeader: this.hideHeader,
//       };

//       const Header = CollapsibleHeaderComponent as React.ComponentType<
//         CollapsibleHeaderProps
//       >;

//       const styles = style(
//         headerHeight,
//         statusBarHeight,
//         headerContainerBackgroundColor,
//         clipHeader,
//       );

//       return (
//         <View style={styles.fill}>
//           <AnimatedComponent
//             bounces={false}
//             overScrollMode={'never'}
//             scrollEventThrottle={1}
//             {...props}
//             ref={this.wrappedComponent}
//             contentContainerStyle={[contentContainerStyle, styles.container]}
//             onMomentumScrollBegin={this.onMomentumScrollBegin}
//             onMomentumScrollEnd={this.onMomentumScrollEnd}
//             onScrollEndDrag={this.onScrollEndDrag}
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { y: this.scrollAnim } } }],
//               { useNativeDriver: true, listener: onScroll },
//             )}
//           />
//           <Animated.View
//             style={[
//               styles.header,
//               [{ transform: [{ translateY: this.headerTranslation }] }],
//             ]}
//           >
//             {React.isValidElement(Header) ? (
//               Header
//             ) : (
//               <Header {...headerProps} />
//             )}
//           </Animated.View>
//         </View>
//       );
//     }

//     private onScrollEndDrag = (
//       event: NativeSyntheticEvent<NativeScrollEvent>,
//     ) => {
//       const { onScrollEndDrag = noop, disableHeaderSnap } = this.props;

//       if (!disableHeaderSnap) {
//         this.scrollEndTimer = setTimeout(this.onMomentumScrollEnd, 250);
//       }

//       onScrollEndDrag(event);
//     };

//     private onMomentumScrollBegin = (
//       event: NativeSyntheticEvent<NativeScrollEvent>,
//     ) => {
//       const { onMomentumScrollBegin = noop, disableHeaderSnap } = this.props;

//       if (!disableHeaderSnap) {
//         clearTimeout(this.scrollEndTimer);
//       }

//       onMomentumScrollBegin(event);
//     };

//     private onMomentumScrollEnd = (
//       event: NativeSyntheticEvent<NativeScrollEvent>,
//     ) => {
//       const {
//         statusBarHeight,
//         onMomentumScrollEnd = noop,
//         headerHeight,
//         disableHeaderSnap,
//       } = this.props;

//       if (!disableHeaderSnap) {
//         this.moveHeader(
//           this.scrollValue > headerHeight &&
//             this.clampedScrollValue > (headerHeight - statusBarHeight) / 2
//             ? this.offsetValue + headerHeight
//             : this.offsetValue - headerHeight,
//         );
//       }

//       onMomentumScrollEnd(event);
//     };

//     private interpolatedHeaderTranslation = (from: number, to: number) => {
//       const { headerHeight, statusBarHeight } = this.props;

//       return this.clampedScroll!.interpolate({
//         inputRange: [0, headerHeight - statusBarHeight],
//         outputRange: [from, to],
//         extrapolate: 'clamp',
//       });
//     };

//     private static isAnimationConfig(
//       options: AnimationConfig | unknown,
//     ): boolean {
//       return options && (options as AnimationConfig).animated !== undefined;
//     }

//     public animatedComponent = () => {
//       return this.wrappedComponent.current;
//     };

//     public getNode = () => {
//       return this.wrappedComponent.current.getNode();
//     };

//     public showHeader = (options: AnimationConfig | unknown) => {
//       this.moveHeader(
//         this.offsetValue - this.props.headerHeight,
//         !CollapsibleHeaderView.isAnimationConfig(options) ||
//           (options as AnimationConfig).animated,
//       );
//     };

//     public hideHeader = (options: AnimationConfig | unknown) => {
//       const { headerHeight } = this.props;

//       this.moveHeader(
//         this.offsetValue +
//           (this.scrollValue > headerHeight ? headerHeight : this.scrollValue),
//         !CollapsibleHeaderView.isAnimationConfig(options) ||
//           (options as AnimationConfig).animated,
//       );
//     };

//     private moveHeader(toValue: number, animated: boolean = true) {
//       if (this.headerSnap) {
//         this.headerSnap.stop();
//       }

//       if (animated) {
//         this.headerSnap = Animated.timing(this.offsetAnim, {
//           toValue,
//           duration: this.props.headerAnimationDuration,
//           useNativeDriver: true,
//         });

//         this.headerSnap.start();
//       } else {
//         this.offsetAnim.setValue(toValue);
//       }
//     }
//   };
// };

const style = memoize((
  headerHeight: number,
  statusBarHeight: number,
  // headerBackgroundColor: string,
  clipHeader: boolean,
) =>
  StyleSheet.create<CollapsibleHeaderViewStyle>({
    fill: {
      flex: 1,
      overflow: clipHeader ? 'hidden' : undefined,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: headerHeight,
      paddingTop: statusBarHeight,
      // backgroundColor: headerBackgroundColor,
    },
    container: {
      paddingTop: headerHeight,
    },
  }),
);

export const TestUseCollapsibleHeader = () => {
  const {
    collapsibleHeaderProps,
    collapsibleScrollViewProps,
  } = useCollapsibleHeader({ headerHeight: 300 });

  const [numbers] = useState([...Array(100).keys()]);

  return (
    <View style={{ backgroundColor: 'red' }}>
      <Animated.ScrollView {...collapsibleScrollViewProps}>
        <ScrollView>
          {numbers.map(num => (
            <Text key={num} style={{ backgroundColor: 'yellow' }}>
              {num}
            </Text>
          ))}
        </ScrollView>
      </Animated.ScrollView>
      <Animated.View
        {...collapsibleHeaderProps}
        style={[...collapsibleHeaderProps.style, { backgroundColor: 'tan' }]}
      >
        <Text>Test</Text>
      </Animated.View>
    </View>
  );
};
