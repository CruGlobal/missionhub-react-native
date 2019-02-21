import { Dimensions } from 'react-native';
import Color from 'color';

import { exists, isAndroid, hasNotch } from './utils/common';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

// See https://github.com/qix-/color for help
function colorConvert({
  color,
  alpha,
  lighten,
  darken,
  negate,
  rotate,
  whiten,
  blacken,
  hex,
}) {
  if (!color) {
    LOG('Pass in a color!');
  }
  let col = Color(color);
  // Lots of things you can do with color stuff
  if (exists(alpha)) {
    col = Color(col).alpha(alpha);
  }
  if (exists(lighten)) {
    col = Color(col).lighten(lighten);
  }
  if (exists(darken)) {
    col = Color(col).darken(darken);
  }
  if (exists(negate)) {
    col = Color(col).negate();
  }
  if (exists(rotate)) {
    col = Color(col).rotate(rotate);
  }
  if (exists(whiten)) {
    col = Color(col).whiten(whiten);
  }
  if (exists(blacken)) {
    col = Color(col).blacken(blacken);
  }
  if (hex === true) {
    return col.hex().toString();
  }
  return col.rgb().toString();
}

export const COLORS = {
  LIGHT_BLUE: '#66D9F0',
  BLUE: '#52C5DC',
  PRIMARY_FADE: 'rgba(68, 200, 232, 0.3)',
  DARK_BLUE: '#007398',
  ACCENT_BLUE: '#005A7F',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GREY: '#505256',
  INACTIVE_GREY: '#A0A2A6',
  LIGHT_GREY: '#B4B6BA',
  EXTRA_LIGHT_GREY: '#E6E8EC',
  TRANSPARENT: 'transparent',
  BLUE_GREEN: '#50DCC8',
  IMPACT_BLUE: '#3EB1C8',
  RED: '#FF5532',
  IOS_BLUE: '#007AFF',
  GREEN: '#44E4AB',
  convert: colorConvert,
};

const PRIMARY = COLORS.DARK_BLUE;
const SECONDARY = COLORS.BLUE;
const BACKGROUND = COLORS.LIGHT_BLUE;
const ACCENT = COLORS.ACCENT_BLUE;

const iPhoneHeaderHeight = 65;
const notchHeight = hasNotch() ? 20 : 0;

export default {
  // base theme
  loadingColor: COLORS.WHITE,
  primaryColor: PRIMARY,
  secondaryColor: SECONDARY,
  accentColor: ACCENT,
  white: COLORS.WHITE,
  black: COLORS.BLACK,
  backgroundColor: BACKGROUND,
  textColor: COLORS.GREY,
  darkText: COLORS.CHARCOAL,
  iconColor: COLORS.WHITE,
  transparent: COLORS.TRANSPARENT,
  statusBarColor: colorConvert({ color: SECONDARY, darken: 0.3, hex: true }),
  buttonHeight: 60,
  buttonBackgroundColor: COLORS.TRANSPARENT,
  buttonBorderColor: COLORS.WHITE,
  buttonBorderWidth: 1,
  buttonTextColor: COLORS.WHITE,
  buttonIconColor: COLORS.WHITE,
  separatorColor: COLORS.EXTRA_LIGHT_GREY,
  separatorHeight: 1,
  headerTextColor: COLORS.WHITE,
  inactiveColor: COLORS.INACTIVE_GREY,
  checkBackgroundColor: COLORS.BLUE_GREEN,
  red: COLORS.RED,
  green: COLORS.GREEN,
  fullWidth: deviceWidth,
  fullHeight: deviceHeight,
  convert: colorConvert,
  impactBlue: COLORS.IMPACT_BLUE,
  grey: COLORS.GREY,
  grey1: '#B2B0B2',
  grey2: '#4E4C4E',
  lightGrey: COLORS.LIGHT_GREY,
  extraLightGrey: COLORS.EXTRA_LIGHT_GREY,
  iosBlue: COLORS.IOS_BLUE,

  contactHeaderIconActiveColor: 'rgba(255,255,255,1)',
  contactHeaderIconInactiveColor: 'rgba(255,255,255,0.4)',

  headerHeight: isAndroid ? 56 : iPhoneHeaderHeight + notchHeight,
  notchHeight,
  swipeTabHeight: 48,
};

const textStyle = {
  color: COLORS.GREY,
  fontFamily: 'SourceSansPro-Regular',
  fontSize: 16,
  lineHeight: 22,
};
const heading1Style = {
  ...textStyle,
  fontFamily: 'SourceSansPro-Light',
  fontSize: 32,
  lineHeight: 38,
};
const heading2Style = {
  ...heading1Style,
  fontSize: 24,
  lineHeight: 30,
};
const strongStyle = {
  ...textStyle,
  fontFamily: 'SourceSansPro-Bold',
  fontWeight: 'bold',
};
const emphasisStyle = {
  ...textStyle,
  fontStyle: 'italic',
};
const unorderedListItemStyle = {
  ...textStyle,
  paddingRight: 16,
  alignSelf: 'flex-start',
};
const orderedListItemStyle = {
  ...textStyle,
  paddingRight: 16,
  alignSelf: 'flex-start',
};
const linkStyle = {
  color: COLORS.BLUE,
  textDecorationColor: COLORS.BLUE,
  textDecorationLine: 'underline',
};
const blockQuoteStyle = {};
const horizontalLineStyle = {
  height: 1,
  backgroundColor: COLORS.EXTRA_LIGHT_GREY,
};
const imageStyle = {
  backgroundColor: COLORS.BLUE,
  height: 60,
  resizeMode: 'contain',
};

export const markdownTheme = {
  text: textStyle,
  heading1: heading1Style,
  heading2: heading2Style,
  strong: strongStyle,
  em: emphasisStyle,
  listItemBullet: unorderedListItemStyle,
  listItemNumber: orderedListItemStyle,
  link: linkStyle,
  blockQuote: blockQuoteStyle,
  hr: horizontalLineStyle,
  image: imageStyle,
};
