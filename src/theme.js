import { Dimensions, Platform } from 'react-native';
import Color from 'color';

import { exists } from './utils/common';
const isAndroid = Platform.OS === 'android';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

// See https://github.com/qix-/color for help
function colorConvert({ color, alpha, lighten, darken, negate, rotate, whiten, blacken, hex }) {
  if (!color) LOG('Pass in a color!');
  let col = Color(color);
  // Lots of things you can do with color stuff
  if (exists(alpha)) col = Color(col).alpha(alpha);
  if (exists(lighten)) col = Color(col).lighten(lighten);
  if (exists(darken)) col = Color(col).darken(darken);
  if (exists(negate)) col = Color(col).negate();
  if (exists(rotate)) col = Color(col).rotate(rotate);
  if (exists(whiten)) col = Color(col).whiten(whiten);
  if (exists(blacken)) col = Color(col).blacken(blacken);
  if (hex === true) {
    return col.hex().toString();
  }
  return col.rgb().toString();
}

export const PRIMARY_BACKGROUND_COLOR = '#007398';
export const PRIMARY_HEADER_COLOR = '#52C5DC';

export const COLORS = {
  LIGHT_BLUE: '#66D9F0',
  BLUE: '#52C5DC',
  PRIMARY_FADE: 'rgba(68, 200, 232, 0.3)',
  DARK_BLUE: '#007398',
  ACCENT_BLUE: '#005A7F',
  WHITE: '#ffffff',
  GREY: '#505256',
  INACTIVE_GREY: '#A0A2A6',
  LIGHT_GREY: '#E6E8EC',
  TRANSPARENT: 'transparent',
  BLUE_GREEN: '#50DCC8',
  RED: '#FF5532',
  convert: colorConvert,
};

const PRIMARY = COLORS.DARK_BLUE;
const SECONDARY = COLORS.BLUE;
const BACKGROUND = COLORS.LIGHT_BLUE;
const ACCENT = COLORS.ACCENT_BLUE;

export default {
  // base theme
  loadingColor: COLORS.WHITE,
  primaryColor: PRIMARY,
  secondaryColor: SECONDARY,
  accentColor: ACCENT,
  white: COLORS.WHITE,
  backgroundColor: BACKGROUND,
  textColor: COLORS.GREY,
  darkText: COLORS.CHARCOAL,
  iconColor: COLORS.WHITE,
  transparent: COLORS.transparent,
  statusBarColor: colorConvert({ color: SECONDARY, darken: 0.3, hex: true }),
  buttonBackgroundColor: COLORS.TRANSPARENT,
  buttonBorderColor: COLORS.WHITE,
  buttonBorderWidth: 1,
  buttonTextColor: COLORS.WHITE,
  buttonIconColor: COLORS.WHITE,
  separatorColor: COLORS.LIGHT_GREY,
  separatorHeight: 1,
  headerTextColor: COLORS.WHITE,
  inactiveColor: COLORS.INACTIVE_GREY,
  checkBackgroundColor: COLORS.BLUE_GREEN,
  red: COLORS.RED,
  fullWidth: deviceWidth,
  fullHeight: deviceHeight,
  convert: colorConvert,

  isAndroid,
  headerHeight: isAndroid ? 56 : 65,
  itemHeight: 90,
};
