import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

export default class Flex extends Component {
  setNativeProps(nativeProps) {
    this._view.setNativeProps(nativeProps);
  }
  render() {
    const { value, direction, align, justify, self: flexSelf, grow, wrap, children, style = {}, animation, ...rest } = this.props;
    let styleObj = {};
    if (value) styleObj.flex = value;
    if (direction) styleObj.flexDirection = direction;
    if (wrap) styleObj.flexWrap = wrap;
    if (grow) styleObj.flexGrow = grow;

    if (align) {
      if (align === 'center') styleObj.alignItems = 'center';
      else if (align === 'start') styleObj.alignItems = 'flex-start';
      else if (align === 'end') styleObj.alignItems = 'flex-end';
      else if (align === 'stretch') styleObj.alignItems = 'stretch';
    }
    if (flexSelf) {
      if (flexSelf === 'center') styleObj.alignSelf = 'center';
      else if (flexSelf === 'start') styleObj.alignSelf = 'flex-start';
      else if (flexSelf === 'end') styleObj.alignSelf = 'flex-end';
      else if (flexSelf === 'stretch') styleObj.alignSelf = 'stretch';
    }
    if (justify) {
      if (justify === 'center') styleObj.justifyContent = 'center';
      else if (justify === 'start') styleObj.justifyContent = 'flex-start';
      else if (justify === 'end') styleObj.justifyContent = 'flex-end';
      else if (justify === 'around') styleObj.justifyContent = 'space-around';
      else if (justify === 'between') styleObj.justifyContent = 'space-between';
    }
    // If animation is passed in, use the animatable library, otherwise don't
    if (animation) {
      return (
        <Animatable.View
          ref={(c) => this._view = c}
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
      <View
        ref={(c) => this._view = c}
        {...rest}
        style={[style, styleObj]}
      >
        {children}
      </View>
    );
  }
}

Flex.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  value: PropTypes.number,
  grow: PropTypes.number,
  direction: PropTypes.oneOf(['row', 'column']),
  wrap: PropTypes.oneOf(['wrap', 'wrap-reverse', 'nowrap']),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'around', 'between']),
  self: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
};
