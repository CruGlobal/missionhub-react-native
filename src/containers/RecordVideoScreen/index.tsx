import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { RNCamera } from 'react-native-camera';

import { navigateBack } from '../../actions/navigation';
import { Text, Touchable } from '../../components/common';
import CloseButton from '../../../assets/images/closeIcon.svg';
import theme from '../../theme';

import CameraRotateIcon from './cameraRotateIcon.svg';
import styles from './styles';

type CameraType = 'front' | 'back';
type VideoState = 'NOT_RECORDING' | 'RECORDING' | 'PROCESSING';

interface RecordVideoScreenNavParams {
  onEndRecord: (uri: string) => void;
}

export const RecordVideoScreen = () => {
  const camera = useRef<RNCamera>(null);
  const dispatch = useDispatch();
  const onEndRecord = useNavigationParam('onEndRecord');
  const [videoState, setVideoState] = useState<VideoState>('NOT_RECORDING');
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null);
  const [countdownTime, setCountdownTime] = useState<number>(15);
  const [cameraType, setCameraType] = useState<CameraType>('front');

  useEffect(() => {
    if (timer && countdownTime <= 0) {
      endRecording();
    }
  }, [countdownTime]);

  useEffect(() => {
    return endCountdown;
  }, []);

  const startCountdown = () => {
    setCountdownTime(15);
    setTimer(
      setInterval(() => {
        setCountdownTime(time => time - 1);
      }, 1000),
    );
  };

  const endCountdown = () => {
    setCountdownTime(15);
    timer && clearInterval(timer);
    setTimer(null);
  };

  const startRecording = async () => {
    if (!camera.current) {
      return;
    }

    setVideoState('RECORDING');
    startCountdown();

    const { uri } = await camera.current.recordAsync();
    console.log(uri);
    onEndRecord(uri);
  };

  const endRecording = () => {
    setVideoState('NOT_RECORDING');
    endCountdown();

    camera.current?.stopRecording();

    dispatch(navigateBack());
  };

  const handleClose = () => dispatch(navigateBack());

  const handleFlipCamera = () =>
    setCameraType(cameraType === 'front' ? 'back' : 'front');

  const renderCloseButton = () => (
    <SafeAreaView style={styles.closeWrap}>
      {videoState === 'NOT_RECORDING' ? (
        <Touchable
          onPress={handleClose}
          type="transparent"
          style={styles.closeButton}
        >
          <CloseButton color={theme.white} height={36} width={36} />
        </Touchable>
      ) : null}
    </SafeAreaView>
  );

  const renderRecordButton = () => (
    <Touchable
      testID="RecordButton"
      style={styles.recordButton}
      onPress={videoState === 'NOT_RECORDING' ? startRecording : endRecording}
    >
      {videoState === 'NOT_RECORDING' ? (
        <View style={styles.startRecordIcon} />
      ) : (
        <View style={styles.endRecordIcon} />
      )}
    </Touchable>
  );

  const renderControlBar = () => (
    <SafeAreaView style={styles.controlBarBackground}>
      <View style={styles.controlBarWrap}>
        <View style={styles.countdownTextWrap}>
          <Text style={styles.countdownText}>{`:${countdownTime}`}</Text>
        </View>
        {renderRecordButton()}
        <Touchable onPress={handleFlipCamera}>
          <CameraRotateIcon />
        </Touchable>
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <RNCamera
        ref={camera}
        style={styles.cameraContainer}
        type={cameraType}
        flashMode={'auto'}
        ratio={'16:9'}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <View style={styles.cameraOverlay}>
          {renderCloseButton()}
          {renderControlBar()}
        </View>
      </RNCamera>
    </View>
  );
};

export const RECORD_VIDEO_SCREEN = 'nav/RECORD_VIDEO_SCREEN';
