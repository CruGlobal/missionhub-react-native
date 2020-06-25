import React from 'react';

jest.mock('react-native-camera', () => {
  const timeout = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  class RNCamera extends React.Component {
    static Constants = {
      Aspect: {},
      BarCodeType: {},
      Type: { back: 'back', front: 'front' },
      CaptureMode: {},
      CaptureTarget: {},
      CaptureQuality: {},
      Orientation: {},
      FlashMode: {},
      TorchMode: {},
    };

    takePictureAsync = async () => {
      await timeout(2000);
      return {
        base64: 'base64string',
      };
    };

    recordAsync = async () => {
      await timeout(2000);
      return {
        uri: 'file:/video.mov',
      };
    };

    stopRecording = () => {};

    render() {
      return 'Camera';
    }
  }

  return { RNCamera };
});
