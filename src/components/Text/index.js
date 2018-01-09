import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import theme from '../../theme';

export default class MyText extends Component {
  setNativeProps(nativeProps) {
    this._text.setNativeProps(nativeProps);
  }
  render() {
    const { children, style, type, animation, ...rest } = this.props;

    const fontFamily = {
      fontFamily: type === 'header' ? 'AmaticSC-Bold' : 'SourceSansPro-Regular',
    };
    let content = children;
    
    const textStyle = [styles.text, fontFamily, style];

    if (animation) {
      return (
        <Animatable.Text
          ref={(c) => this._text = c}
          animation={animation}
          {...rest}
          style={textStyle}>
          {content}
        </Animatable.Text>
      );
    }
    return (
      <Text
        ref={(c) => this._text = c}
        {...rest}
        style={textStyle}>
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
