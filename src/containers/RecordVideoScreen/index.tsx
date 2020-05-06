import React from 'react';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';

enum VideoState {
  NOT_RECORDING,
  RECORDING,
  PROCESSING,
}

export const RecordVideoScreen = () => {
  const startRecording = () => {};

  const endRecording = () => {};

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ position: 'absolute', flex: 1, top: 0, left: 0 }}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />
    </View>
  );
};
