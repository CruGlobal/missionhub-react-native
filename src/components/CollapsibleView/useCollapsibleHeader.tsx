import { useEffect, useRef, useMemo } from 'react';
import { ScrollViewProps, ViewStyle, StyleSheet, Animated } from 'react-native';

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

// Converted into a hook from https://github.com/iyegoroff/react-native-collapsible-header-views/blob/master/src/with-collapsible-header.tsx
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
  const scrollEndTimer = useRef<number | undefined>(undefined);
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
      scrollEndTimer.current = window.setTimeout(onMomentumScrollEnd, 250);
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

  return useMemo(() => {
    const styles = StyleSheet.create<CollapsibleHeaderViewStyle>({
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
      },
      container: {
        paddingTop: headerHeight,
      },
    });

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
      overScrollMode: 'never' as ScrollViewProps[keyof ScrollViewProps['overScrollMode']],
      scrollEventThrottle: 1,
      contentContainerStyle: styles.container,
      onMomentumScrollBegin: onMomentumScrollBegin,
      onMomentumScrollEnd: onMomentumScrollEnd,
      onScrollEndDrag: onScrollEndDrag,
      onScroll: Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollAnim.current } } }],
        { useNativeDriver: false }, // ImpactView doesn't make the header collapse if this is set to true :( Changing the number of tabs makes different tabs work.
      ),
    };

    return {
      collapsibleHeaderProps: headerProps,
      collapsibleScrollViewProps,
    };
  }, [headerHeight, statusBarHeight, clipHeader, disableHeaderSnap]);
};
