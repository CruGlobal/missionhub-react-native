import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import theme from '../../theme';
import I18n from '../../i18n';

export default class MyText extends Component {
  setNativeProps(nativeProps) {
    this._text.setNativeProps(nativeProps);
  }
  render() {
    const { children, i18n, style, type, animation, ...rest } = this.props;

    const fontFamily = {
      fontFamily: type === 'header' ? 'AmaticSC-Bold' : 'SourceSansPro-Regular',
    };
    let content = children;
    if (i18n) {
      content = I18n.t(i18n);
    }
    
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
