import { StyleSheet, Dimensions } from 'react-native';
import Color from 'color';

import { exists } from './utils/common';

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

export const DEFAULT = {
  FULL_WIDTH: deviceWidth,
  FULL_HEIGHT: deviceHeight,
};

export const COLORS = {
  BLUE: '#44c8e8',
  PRIMARY_FADE: 'rgba(68, 200, 232, 0.3)',
  DARK_BLUE: '#186078',
  OFF_BLUE: '#3295AD',
  ORANGE: '#f96332',
  RED: '#ee2f2f',
  PINK: '#dd4499',
  GREEN: '#00FF4F',
  YELLOW: '#FFF462',
  BLACK: '#1d1d26',
  DEEP_BLACK: '#000000',
  WHITE: '#ffffff',
  OFF_WHITE: 'rgba(245,245,245,1)',
  GREY: '#98a6b1',
  GREY_FADE: 'rgba(152, 166, 177, 0.25)',
  WHITE_FADE: 'rgba(245, 250, 255, 0.5)',
  BLACK_FADE: 'rgba(0, 0, 0, 0.7)',
  DARK_GREY: '#637076',
  CHARCOAL: '#646464',
  SILVER: '#dce1e4',
  LIGHT_GREY: '#bbbbbb',
  LIGHTEST_GREY: '#ebebeb',
  TRANSPARENT: 'transparent',
  convert: colorConvert,
};

const PRIMARY = COLORS.DARK_BLUE;
const SECONDARY = COLORS.BLUE;
const ACCENT = COLORS.OFF_BLUE;

export default {
  // base theme
  loadingColor: COLORS.WHITE,
  primaryColor: PRIMARY,
  secondaryColor: SECONDARY,
  accentColor: ACCENT,
  backgroundColor: PRIMARY,
  lightBackgroundColor: COLORS.WHITE,
  darkBackgroundColor: COLORS.BLACK,
  textColor: COLORS.WHITE,
  lightText: COLORS.WHITE,
  darkText: COLORS.CHARCOAL,
  iconColor: COLORS.WHITE,
  transparent: COLORS.transparent,
  statusBarColor: colorConvert({ color: SECONDARY, darken: 0.3, hex: true }),
  buttonBackgroundColor: COLORS.TRANSPARENT,
  buttonBorderColor: COLORS.WHITE,
  buttonBorderWidth: 1,
  buttonTextColor: COLORS.WHITE,
  buttonIconColor: COLORS.WHITE,
  separatorColor: SECONDARY,
  // separatorHeight: StyleSheet.hairlineWidth + (Platform.OS === 'android' ? 0.2 : 0),
  separatorHeight: StyleSheet.hairlineWidth,
  // header
  headerBackgroundColor: SECONDARY,
  headerTextColor: COLORS.WHITE,
  // message
  messageHeaderTextColor: COLORS.GREEN,

};
