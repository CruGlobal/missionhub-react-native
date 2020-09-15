// Taken from https://github.com/ovr/react-native-status-bar-height/blob/master/index.js v2.5.0

import { Dimensions, Platform, StatusBar } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

let isIPhoneX_v = false;
let isIPhoneXMax_v = false;
let isIPhoneWithMonobrow_v = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  if (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) {
    isIPhoneWithMonobrow_v = true;
    isIPhoneX_v = true;
  }

  if (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT) {
    isIPhoneWithMonobrow_v = true;
    isIPhoneXMax_v = true;
  }
}

// eslint-disable-next-line import/no-unused-modules
export const isIPhoneX = () => isIPhoneX_v;
// eslint-disable-next-line import/no-unused-modules
export const isIPhoneXMax = () => isIPhoneXMax_v;
// eslint-disable-next-line import/no-unused-modules
export const isIPhoneWithMonobrow = () => isIPhoneWithMonobrow_v;

export function getStatusBarHeight(skipAndroid = false) {
  return Platform.select({
    ios: isIPhoneWithMonobrow() ? 44 : 20,
    android: skipAndroid ? 0 : StatusBar.currentHeight,
    default: 0,
  });
}
