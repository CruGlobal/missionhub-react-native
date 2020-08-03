// This file was found here: https://stackoverflow.com/questions/43058801/typescript-path-mapping-for-react-native-android-ts-and-ios-ts-modules?rq=1
// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
import DefaultIos from './index.ios';
import * as ios from './index.ios';
import DefaultAndroid from './index.android';
import * as android from './index.android';

declare const _test: typeof ios;
declare const _test: typeof android;

declare const _testDefault: typeof DefaultIos;
declare const _testDefault: typeof DefaultAndroid;

export * from './index.ios';
export default DefaultIos;
