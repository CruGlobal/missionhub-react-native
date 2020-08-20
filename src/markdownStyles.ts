import { Platform, StyleSheet } from 'react-native';

import theme from './theme';

const textStyle = theme.textRegular16;
const heading1Style = { ...theme.textLight32, marginVertical: 10 };
const heading2Style = { ...theme.textLight24, marginVertical: 10 };
const heading3Style = {
  ...theme.textBold16,
  fontSize: 20,
  lineHeight: 22,
  lineSpacing: 0,
  marginVertical: 16,
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
  left: -32,
  width: theme.fullWidth,
  backgroundColor: theme.extraLightGrey,
  paddingVertical: 16,
  paddingHorizontal: 32,
};
const horizontalLineStyle = {
  left: -32,
  height: 1,
  width: theme.fullWidth,
  backgroundColor: theme.separatorColor,
  marginVertical: 8,
  marginHorizontal: 0,
};
const imageStyle = {
  left: -32,
  height: 200,
  width: theme.fullWidth,
};

export default StyleSheet.create({
  body: textStyle,
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
  image: imageStyle,
});
