import { Dimensions, StatusBarStyle } from 'react-native';
import Color from 'color';

import { isAndroid } from './utils/common';

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
}: {
  color: string;
  alpha?: number;
  lighten?: number;
  darken?: number;
  negate?: number;
  rotate?: number;
  whiten?: number;
  blacken?: number;
  hex?: boolean;
}): string {
  let col = Color(color);
  // Lots of things you can do with color stuff
  if (alpha) {
    col = Color(col).alpha(alpha);
  }
  if (lighten) {
    col = Color(col).lighten(lighten);
  }
  if (darken) {
    col = Color(col).darken(darken);
  }
  if (negate) {
    col = Color(col).negate();
  }
  if (rotate) {
    col = Color(col).rotate(rotate);
  }
  if (whiten) {
    col = Color(col).whiten(whiten);
  }
  if (blacken) {
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
  PARAKEET_BLUE: '#3CC8E6',
  DARK_BLUE: '#007398',
  ACCENT_BLUE: '#005A7F',
  WHITE: '#ffffff',
  BLACK: '#000000',
  CAVERN_GREY: '#505256',
  INACTIVE_GREY: '#A0A2A6',
  NARWHAL_GREY: '#B4B6BA',
  EXTRA_LIGHT_GREY: '#ECEEF2',
  TRANSPARENT: 'transparent',
  IMPACT_BLUE: '#3EB1C8',
  RED: '#FF5532',
  DARK_RED: '#260C06',
  IOS_BLUE: '#007AFF',
  GREEN: '#44E4AB',
  SPEARMINT_GREEN: '#00CA99',
  BLUE_PURPLE: '#7076B5',
  LIGHT_ORANGE: '#FFA178',
  LIGHT_RED: '#FD726D',
  RED_PURPLE: '#A97398',
  convert: colorConvert,
};

const statusBar = {
  backgroundColor: colorConvert({
    color: COLORS.DARK_BLUE,
    darken: 0.1,
    hex: true,
  }),
  animated: true,
};

export default {
  // base theme
  loadingColor: COLORS.WHITE,
  primaryColor: COLORS.DARK_BLUE,
  secondaryColor: COLORS.BLUE,
  accentColor: COLORS.ACCENT_BLUE,
  white: COLORS.WHITE,
  black: COLORS.BLACK,
  backgroundColor: COLORS.LIGHT_BLUE,
  textColor: COLORS.CAVERN_GREY,
  iconColor: COLORS.WHITE,
  transparent: COLORS.TRANSPARENT,
  buttonHeight: 60,
  buttonBackgroundColor: COLORS.TRANSPARENT,
  buttonBorderWidth: 1,
  buttonTextColor: COLORS.WHITE,
  separatorColor: COLORS.EXTRA_LIGHT_GREY,
  separatorHeight: 1,
  headerTextColor: COLORS.WHITE,
  inactiveColor: COLORS.INACTIVE_GREY,
  red: COLORS.RED,
  darkRed: COLORS.DARK_RED,
  green: COLORS.GREEN,
  fullWidth: deviceWidth,
  fullHeight: deviceHeight,
  convert: colorConvert,
  impactBlue: COLORS.IMPACT_BLUE,
  grey: COLORS.CAVERN_GREY,
  grey1: '#B2B0B2',
  grey2: '#4E4C4E',
  grey3: '#C5C7CB',
  lightGrey: COLORS.NARWHAL_GREY,
  extraLightGrey: COLORS.EXTRA_LIGHT_GREY,
  iosBlue: COLORS.IOS_BLUE,
  communityBlue: COLORS.PARAKEET_BLUE,
  communityProfileGreen: COLORS.SPEARMINT_GREEN,
  communityPrayerRequestPurple: COLORS.RED_PURPLE,
  communityQuestionOrange: COLORS.LIGHT_ORANGE,
  communityGodStoryPurple: COLORS.BLUE_PURPLE,
  communityCareRequestRed: COLORS.LIGHT_RED,
  communityChallengeGreen: COLORS.SPEARMINT_GREEN,
  communityThoughtGrey: COLORS.NARWHAL_GREY,
  communityAnnouncementGrey: COLORS.CAVERN_GREY,

  contactHeaderIconActiveColor: 'rgba(255,255,255,1)',
  contactHeaderIconInactiveColor: 'rgba(255,255,255,0.4)',

  headerHeight: 56,
  swipeTabHeight: 48,
  communityImageAspectRatio: 9 / 16,
  statusBar: {
    lightContent: {
      ...statusBar,
      barStyle: 'light-content' as StatusBarStyle,
    },
    darkContent: {
      ...statusBar,
      barStyle: (isAndroid
        ? 'light-content'
        : 'dark-content') as StatusBarStyle,
    },
  },
  hitSlop: (n: number) => ({ top: n, right: n, left: n, bottom: n }),
};
