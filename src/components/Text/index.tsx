import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import theme from '../../theme';

interface InternalTextProps {
  children: ReactNode;
  type?: string;
}

const MyText = ({
  children,
  style = {},
  type,
  ...rest
}: TextProps & InternalTextProps) => {
  const isHeader = type === 'header';

  const fontFamily = {
    fontFamily: isHeader ? 'AmaticSC-Bold' : 'SourceSansPro-Regular',
  };
  const content =
    isHeader && typeof children === 'string'
      ? children.toLowerCase()
      : children;

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
