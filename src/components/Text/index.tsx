import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import theme from '../../theme';

interface InternalTextProps {
  children: ReactNode;
  header?: boolean;
}

const MyText = ({
  children,
  style = {},
  header,
  ...rest
}: TextProps & InternalTextProps) => {
  const fontFamily = {
    fontFamily: header ? 'AmaticSC-Bold' : 'SourceSansPro-Regular',
  };
  const content =
    header && typeof children === 'string' ? children.toLowerCase() : children;

  const textStyle = [styles.text, fontFamily, style];

  return (
    <Text {...rest} style={textStyle}>
      {content}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: theme.textColor,
  },
});

export default MyText;
