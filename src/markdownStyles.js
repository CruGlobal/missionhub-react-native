import { StyleSheet } from 'react-native';

import theme from './theme';

const textStyle = {
  color: theme.textColor,
  fontFamily: 'SourceSansPro-Regular',
  fontSize: 16,
  lineHeight: 24,
};
const heading1Style = {
  ...textStyle,
  fontFamily: 'SourceSansPro-Light',
  fontSize: 32,
  lineHeight: 38,
  marginVertical: 10,
};
const heading2Style = {
  ...heading1Style,
  fontSize: 24,
  lineHeight: 30,
};
const heading3Style = {
  ...heading1Style,
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 22,
  marginVertical: 16,
};
const strongStyle = {
  ...textStyle,
  fontFamily: 'SourceSansPro-Bold',
};
const emphasisStyle = {
  ...textStyle,
  fontFamily: 'SourceSansPro-Italic',
};
const paragraph = {
  marginVertical: 10,
};
const listItemOrderedIconStyle = {
  ...textStyle,
  marginRight: 16,
  alignSelf: 'center',
  lineHeight: 36,
};
const listItemUnorderedIconStyle = {
  ...listItemOrderedIconStyle,
  fontSize: 30,
};
const linkStyle = {
  ...textStyle,
  lineHeight: 22,
  color: theme.secondaryColor,
  textDecorationColor: theme.secondaryColor,
  textDecorationLine: 'underline',
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
  text: textStyle,
  heading1: heading1Style,
  heading2: heading2Style,
  heading3: heading3Style,
  strong: strongStyle,
  em: emphasisStyle,
  paragraph: paragraph,
  listUnorderedItemIcon: listItemUnorderedIconStyle,
  listOrderedItemIcon: listItemOrderedIconStyle,
  link: linkStyle,
  blockquote: blockQuoteStyle,
  hr: horizontalLineStyle,
  image: imageStyle,
});
