/* eslint complexity: 0, max-lines-per-function: 0 */
import React, { forwardRef } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ReactNode } from 'react';
import { Ref } from 'react';

interface FlexProps {
  style?: StyleProp<ViewStyle>;
  value?: number;
  grow?: number;
  direction?: 'row' | 'column';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'around' | 'between';
  self?: 'start' | 'center' | 'end' | 'stretch';
  animated?: boolean;
  children?: ReactNode;
  animation?: string;
}

const Flex = forwardRef(
  (
    {
      value,
      direction,
      align,
      justify,
      self: flexSelf,
      grow,
      wrap,
      children,
      style = {},
      animation,
      animated,
      ...rest
    }: FlexProps,
    ref: Ref<View>,
  ) => {
    const styleObj: StyleProp<ViewStyle> = {};
    if (value) {
      styleObj.flex = value;
    }
    if (direction) {
      styleObj.flexDirection = direction;
    }
    if (wrap) {
      styleObj.flexWrap = wrap;
    }
    if (grow) {
      styleObj.flexGrow = grow;
    }
    if (align) {
      if (align === 'center') {
        styleObj.alignItems = 'center';
      } else if (align === 'start') {
        styleObj.alignItems = 'flex-start';
      } else if (align === 'end') {
        styleObj.alignItems = 'flex-end';
      } else if (align === 'stretch') {
        styleObj.alignItems = 'stretch';
      }
    }
    if (flexSelf) {
      if (flexSelf === 'center') {
        styleObj.alignSelf = 'center';
      } else if (flexSelf === 'start') {
        styleObj.alignSelf = 'flex-start';
      } else if (flexSelf === 'end') {
        styleObj.alignSelf = 'flex-end';
      } else if (flexSelf === 'stretch') {
        styleObj.alignSelf = 'stretch';
      }
    }
    if (justify) {
      if (justify === 'center') {
        styleObj.justifyContent = 'center';
      } else if (justify === 'start') {
        styleObj.justifyContent = 'flex-start';
      } else if (justify === 'end') {
        styleObj.justifyContent = 'flex-end';
      } else if (justify === 'around') {
        styleObj.justifyContent = 'space-around';
      } else if (justify === 'between') {
        styleObj.justifyContent = 'space-between';
      }
    }
    // If animation is passed in, use the animatable library, otherwise don't
    if (animation || animated) {
      return (
        <Animatable.View
          ref={ref}
          duration={400}
          animation={animation}
          {...rest}
          style={[style, styleObj]}
        >
          {children}
        </Animatable.View>
      );
    }
    return (
      <View ref={ref} {...rest} style={[style, styleObj]}>
        {children}
      </View>
    );
  },
);

Flex.displayName = 'Flex';

export default Flex;
