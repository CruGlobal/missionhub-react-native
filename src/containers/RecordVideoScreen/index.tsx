import React, { useState } from 'react';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import Button from '../../components/Button';
import CloseButton from '../../../assets/images/closeButton.svg';

enum VideoState {
  NOT_RECORDING,
  RECORDING,
  PROCESSING,
}

export const RecordVideoScreen = () => {
  const [countDownTime, setCountdownTime] = useState<number>(15);

  const startRecording = () => {};

  const endRecording = () => {};

  const handleBuffer = () => {};

  const handleError = (error: Error) => {
    return error;
  };

  const handleClose = () => {};

  const renderCloseButton = () => (
    <Button onPress={handleClose}>
      <CloseButton />
    </Button>
  );

  const renderControlBar = () => (
    <View>
      <Text>asdf</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />
      {renderCloseButton()}
    </View>
  );
};

export const RECORD_VIDEO_SCREEN = 'nav/RECORD_VIDEO_SCREEN';
