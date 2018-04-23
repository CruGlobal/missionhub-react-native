import { NativeModules } from 'react-native';

// From https://github.com/facebook/react-native/issues/18279#issuecomment-374177940
// Will be made unnecessary once https://github.com/facebook/react-native/pull/18718 is released. It doesn't seem to be in 0.55.3
NativeModules.BlobModule = {
  ...NativeModules.BlobModule,
  addNetworkingHandler: jest.fn(),
};
