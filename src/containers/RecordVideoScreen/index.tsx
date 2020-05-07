import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { RNCamera } from 'react-native-camera';

import { Text, Button } from '../../components/common';
import CloseButton from '../../../assets/images/closeIcon.svg';
import theme from '../../theme';

enum VideoState {
  NOT_RECORDING,
  RECORDING,
  PROCESSING,
}

export const RecordVideoScreen = () => {
  const [videoState, setVideoState] = useState<VideoState>(
    VideoState.NOT_RECORDING,
  );
  const [countDownTime, setCountdownTime] = useState<number>(15000);

  const startRecording = () => {};

  const endRecording = () => {};

  const handleBuffer = () => {};

  const handleError = (error: Error) => {
    return error;
  };

  const handleClose = () => {};

  const renderCloseButton = () => (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 18,
      }}
    >
      <Button
        onPress={handleClose}
        type="transparent"
        style={{ backgroundColor: theme.black, borderRadius: 18, opacity: 0.5 }}
      >
        <CloseButton color={theme.white} height={36} width={36} />
      </Button>
    </SafeAreaView>
  );

  const renderRecordButton = () =>
    videoState === VideoState.NOT_RECORDING ? (
      <Button
        type="transparent"
        onPress={startRecording}
        style={{ backgroundColor: theme.parakeetBlue }}
        text={'START'}
      />
    ) : (
      <Button
        onPress={endRecording}
        pill={true}
        style={{ backgroundColor: theme.red }}
        text={'STOP'}
      />
    );

  const renderControlBar = () => (
    <View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: 'black',
          opacity: 0.5,
        }}
      />
      <SafeAreaView style={{ flexDirection: 'row', padding: 24 }}>
        <Text>{`:${Math.ceil(countDownTime / 1000)}`}</Text>
        {renderRecordButton()}
      </SafeAreaView>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      {renderCloseButton()}
      {renderControlBar()}
    </View>
  );
};

export const RECORD_VIDEO_SCREEN = 'nav/RECORD_VIDEO_SCREEN';

/*<View style={{ flex: 1 }}>
      <RNCamera
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />*/
