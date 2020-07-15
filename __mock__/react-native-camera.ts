jest.mock('react-native-camera', () => {
  const React = require('react');

  const MOCK_IMAGE = 'data:image/jpeg;base64,base64image.jpeg';
  const MOCK_VIDEO = 'file:/video.mov';

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

    takePictureAsync = jest.fn().mockImplementation(async () => {
      await timeout(2000);
      return {
        base64: MOCK_IMAGE,
      };
    });

    recordAsync = jest.fn().mockImplementation(async () => {
      await timeout(2000);
      return {
        codec: 'mp4',
        uri: MOCK_VIDEO,
      };
    });

    stopRecording = jest.fn();

    render() {
      return this.props.children;
    }
  }

  return { RNCamera };
});
