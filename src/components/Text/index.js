import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';

import theme from '../../theme';

export default class MyText extends Component {
  setNativeProps(nativeProps) {
    this._text.setNativeProps(nativeProps);
  }

  animatableRef = c => (this._text = c);

  ref = c => (this._text = c);

  render() {
    const { children, style, type, animation, ...rest } = this.props;
    const isHeader = type === 'header';

    const fontFamily = {
      fontFamily: isHeader ? 'AmaticSC-Bold' : 'SourceSansPro-Regular',
    };
    const content =
      isHeader && typeof children === 'string'
        ? children.toLowerCase()
        : children;

    const textStyle = [styles.text, fontFamily, style];

    if (animation) {
      return (
        <Animatable.Text
          ref={this.animatableRef}
          animation={animation}
          {...rest}
          style={textStyle}
        >
          {content}
        </Animatable.Text>
      );
    }
    return (
      <Text ref={this.ref} {...rest} style={textStyle}>
        {content}
      </Text>
    );
  }
}

MyText.propTypes = Text.propTypes;
MyText.defaultProps = Text.defaultProps;

const styles = StyleSheet.create({
  text: {
    color: theme.textColor,
  },
});
