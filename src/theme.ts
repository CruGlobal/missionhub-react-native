import { Dimensions, StatusBarStyle, TextStyle } from 'react-native';
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
  ABYSS_BLUE: '#005A7F',
  MACAW_BLUE: '#007398',
  PARAKEET_BLUE: '#3CC8E6',
  GLACIER_BLUE: '#B2ECF7',
  CAVERN_GREY: '#505256',
  NARWHAL_GREY: '#B4B6BA',
  SMOKE_GREY: '#ECEEF2',
  SPEARMINT_GREEN: '#00CA99',
  HONEYCRISP_ORANGE: '#FF5532',
  BLUE_PURPLE: '#7076B5',
  LIGHT_ORANGE: '#FFA178',
  LIGHT_RED: '#FD726D',
  RED_PURPLE: '#A97398',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
};

const baseTextStyle: TextStyle = {
  color: COLORS.CAVERN_GREY,
  fontStyle: 'normal',
};

export const TEXT_STYLES: { [key: string]: TextStyle } = {
  LIGHT_32: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '300',
    fontSize: 32,
    lineHeight: 38,
  },
  LIGHT_24: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 30,
  },
  REGULAR_16: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  REGULAR_14: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 20,
  },
  REGULAR_12: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 16,
  },
  REGULAR_10: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    fontSize: 10,
    lineHeight: 14,
  },
  BOLD_16: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  BOLD_14: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  AMATIC_48: {
    ...baseTextStyle,
    fontFamily: 'AmaticSC-Bold',
    fontWeight: 'bold',
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
  AMATIC_42: {
    ...baseTextStyle,
    fontFamily: 'AmaticSC-Bold',
    fontWeight: 'bold',
    fontSize: 42,
    lineHeight: 42,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
  AMATIC_36: {
    ...baseTextStyle,
    fontFamily: 'AmaticSC-Bold',
    fontWeight: 'bold',
    fontSize: 36,
    lineHeight: 36,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
};

const statusBar = {
  backgroundColor: colorConvert({
    color: COLORS.ABYSS_BLUE,
    hex: true,
  }),
  animated: true,
};

export default {
  // base theme
  primaryColor: COLORS.ABYSS_BLUE,
  secondaryColor: COLORS.PARAKEET_BLUE,
  accentColor: COLORS.MACAW_BLUE,
  lightBlue: COLORS.GLACIER_BLUE,
  white: COLORS.WHITE,
  black: COLORS.BLACK,
  orange: COLORS.HONEYCRISP_ORANGE,
  green: COLORS.SPEARMINT_GREEN,
  darkGrey: COLORS.CAVERN_GREY,
  lightGrey: COLORS.NARWHAL_GREY,
  extraLightGrey: COLORS.SMOKE_GREY,
  parakeetBlue: COLORS.PARAKEET_BLUE,
  textColor: COLORS.CAVERN_GREY,
  separatorColor: COLORS.SMOKE_GREY,
  headerTextColor: COLORS.WHITE,
  communityProfileGreen: COLORS.SPEARMINT_GREEN,
  communityPrayerRequestPurple: COLORS.RED_PURPLE,
  communityQuestionOrange: COLORS.LIGHT_ORANGE,
  communityGodStoryPurple: COLORS.BLUE_PURPLE,
  communityHelpRequestRed: COLORS.LIGHT_RED,
  communityChallengeGreen: COLORS.SPEARMINT_GREEN,
  communityThoughtGrey: COLORS.NARWHAL_GREY,
  communityAnnouncementGrey: COLORS.CAVERN_GREY,
  transparent: COLORS.TRANSPARENT,
  buttonHeight: 60,
  buttonBorderWidth: 1,
  separatorHeight: 1,
  fullWidth: deviceWidth,
  fullHeight: deviceHeight,
  convert: colorConvert,
  headerHeight: 56,
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
