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
  WHITE: '#ffffff',
  BLACK: '#000000',
  CAVERN_GREY: '#505256',
  NARWHAL_GREY: '#B4B6BA',
  SMOKE_GREY: '#ECEEF2',
  TRANSPARENT: 'transparent',
  BLACK_FADE: 'rgba(0,0,0,0.5)',
  HONEYCRISP_ORANGE: '#FF5532',
  SPEARMINT_GREEN: '#00CA99',
  BLUE_PURPLE: '#7076B5',
  LIGHT_ORANGE: '#FFA178',
  LIGHT_RED: '#FD726D',
  RED_PURPLE: '#A97398',
};

const baseTextStyle: TextStyle = {
  color: COLORS.CAVERN_GREY,
  fontStyle: 'normal',
  textAlignVertical: 'center',
  textTransform: 'none',
};

export const TEXT_STYLES: { [key: string]: TextStyle } = {
  LIGHT_32: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Light',
    fontSize: 32,
    lineHeight: 38,
  },
  LIGHT_24: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Light',
    fontSize: 24,
    lineHeight: 30,
  },
  REGULAR_16: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  REGULAR_14: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  REGULAR_12: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  REGULAR_10: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 10,
    lineHeight: 14,
  },
  BOLD_16: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  BOLD_14: {
    ...baseTextStyle,
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  AMATIC_48: {
    ...baseTextStyle,
    fontFamily: 'AmaticSC-Bold',
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
  AMATIC_42: {
    ...baseTextStyle,
    fontFamily: 'AmaticSC-Bold',
    fontSize: 42,
    lineHeight: 42,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
  AMATIC_36: {
    ...baseTextStyle,
    fontFamily: 'AmaticSC-Bold',
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
  primaryColor: COLORS.MACAW_BLUE,
  secondaryColor: COLORS.PARAKEET_BLUE,
  accentColor: COLORS.ABYSS_BLUE,
  lightBlue: COLORS.GLACIER_BLUE,
  white: COLORS.WHITE,
  black: COLORS.BLACK,
  orange: COLORS.HONEYCRISP_ORANGE,
  green: COLORS.SPEARMINT_GREEN,
  darkGrey: COLORS.CAVERN_GREY,
  lightGrey: COLORS.NARWHAL_GREY,
  extraLightGrey: COLORS.SMOKE_GREY,
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
  fadedBlackBackgroundColor: COLORS.BLACK_FADE,
  textLight32: TEXT_STYLES.LIGHT_32,
  textLight24: TEXT_STYLES.LIGHT_24,
  textRegular16: TEXT_STYLES.REGULAR_16,
  textRegular14: TEXT_STYLES.REGULAR_14,
  textRegular12: TEXT_STYLES.REGULAR_12,
  textRegular10: TEXT_STYLES.REGULAR_10,
  textBold16: TEXT_STYLES.BOLD_16,
  textBold14: TEXT_STYLES.BOLD_14,
  textAmatic48: TEXT_STYLES.AMATIC_48,
  textAmatic42: TEXT_STYLES.AMATIC_42,
  textAmatic36: TEXT_STYLES.AMATIC_36,
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
