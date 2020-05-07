import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';

import { Text, Button, Touchable } from '../../components/common';
import CloseButton from '../../../assets/images/closeIcon.svg';
import theme from '../../theme';

import CameraRotateIcon from './cameraRotateIcon.svg';
import styles from './styles';

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

  const handleClose = () => {};

  const handleFlipCamera = () => {};

  const renderCloseButton = () => (
    <SafeAreaView style={styles.closeButtonWrap}>
      <Button
        onPress={handleClose}
        type="transparent"
        style={styles.closeButton}
      >
        <CloseButton color={theme.white} height={36} width={36} />
      </Button>
    </SafeAreaView>
  );

  const renderRecordButton = () => (
    <Touchable
      style={styles.recordButton}
      onPress={
        videoState === VideoState.NOT_RECORDING ? startRecording : endRecording
      }
    >
      {videoState === VideoState.NOT_RECORDING ? (
        <View style={styles.startRecordIcon} />
      ) : (
        <View style={styles.endRecordIcon} />
      )}
    </Touchable>
  );

  const renderControlBar = () => (
    <View>
      <View style={styles.controlBarBackground} />
      <SafeAreaView>
        <View style={styles.controlBarContainer}>
          <Text style={styles.countdownText}>{`:${Math.ceil(
            countDownTime / 1000,
          )}`}</Text>
          {renderRecordButton()}
          <Touchable onPress={handleFlipCamera}>
            <CameraRotateIcon />
          </Touchable>
        </View>
      </SafeAreaView>
    </View>
  );

  return (
    <View style={styles.container}>
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
