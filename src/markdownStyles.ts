import { createElement, ReactNode, isValidElement } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { RenderRules } from 'react-native-markdown-display';

import theme from './theme';

const bodyStyles = { ...theme.textRegular16 };
const heading1Style = {
  ...theme.textLight32,
  marginVertical: 10,
  paddingHorizontal: 32,
};
const heading2Style = {
  ...theme.textLight24,
  marginVertical: 10,
  paddingHorizontal: 32,
};
const heading3Style = {
  ...theme.textBold16,
  fontSize: 20,
  lineHeight: 22,
  letterSpacing: 0,
  marginVertical: 16,
  paddingHorizontal: 32,
  textTransform: 'none',
};
const strongStyle = {
  fontFamily: 'SourceSansPro-Bold',
};
const emphasisStyle = {
  fontFamily: 'SourceSansPro-Italic',
};
const paragraph = {
  marginVertical: 10,
};
const listItemUnorderedIconStyle = {
  ...Platform.select({
    ios: {
      // Make bullet bigger
      fontSize: 30,
      // Make bullet aligned vertically with first line instead of shifted above it
      lineHeight: 42,
    },
  }),
};
const linkStyle = {
  lineHeight: 22,
  color: theme.secondaryColor,
  textDecorationColor: theme.secondaryColor,
};
const blockQuoteStyle = {
  width: '100%',
  backgroundColor: theme.extraLightGrey,
  paddingVertical: 16,
};
const horizontalLineStyle = {
  left: -32,
  height: 1,
  width: theme.fullWidth,
  backgroundColor: theme.separatorColor,
  marginVertical: 8,
  marginHorizontal: 0,
};

export default StyleSheet.create({
  body: bodyStyles,
  plainText: { color: 'red' },
  heading1: heading1Style,
  heading2: heading2Style,
  heading3: heading3Style,
  strong: strongStyle,
  em: emphasisStyle,
  paragraph: paragraph,
  bullet_list_icon: listItemUnorderedIconStyle,
  link: linkStyle,
  blockquote: blockQuoteStyle,
  hr: horizontalLineStyle,
});

export const MarkdownRules: RenderRules = {
  paragraph: (_, children) => {
    const isImage = (n: ReactNode) => {
      //Determine if child node is an image
      if (isValidElement(n) && n.props.source) {
        return true;
      }
      return false;
    };

    if (children.some(c => isImage(c))) {
      return createElement(
        View,
        {
          style: { ...paragraph, paddingHorizontal: 0 },
        },
        children,
      );
    }
    return createElement(
      View,
      {
        style: { ...paragraph, paddingHorizontal: 32 },
      },
      children,
    );
  },
};
