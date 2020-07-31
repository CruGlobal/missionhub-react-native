import React, { useState, useRef } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';
import { RNCamera, RecordResponse } from 'react-native-camera';

import { navigateBack } from '../../actions/navigation';
import { Text, Touchable } from '../../components/common';
import CloseButton from '../../../assets/images/closeIcon.svg';
import { useInterval } from '../../utils/hooks/useInterval';
import theme from '../../theme';

import CameraRotateIcon from './cameraRotateIcon.svg';
import styles from './styles';

type CameraType = 'front' | 'back';
type VideoState = 'NOT_RECORDING' | 'RECORDING' | 'PROCESSING';

interface RecordVideoScreenNavParams {
  onEndRecord: (response: RecordResponse) => void;
}

export const RecordVideoScreen = () => {
  const { t } = useTranslation('recordVideo');
  const camera = useRef<RNCamera>(null);
  const dispatch = useDispatch();
  const onEndRecord: (response: RecordResponse) => void = useNavigationParam(
    'onEndRecord',
  );
  const [videoState, setVideoState] = useState<VideoState>('NOT_RECORDING');
  const [countdownTime, setCountdownTime] = useState<number>(15);
  const [cameraType, setCameraType] = useState<CameraType>('front');

  useInterval(
    () => setCountdownTime(Math.max(countdownTime - 1, 0)),
    1000,
    videoState !== 'RECORDING',
  );

  const startRecording = async () => {
    if (!camera.current) {
      return;
    }

    const response = await camera.current.recordAsync({ maxDuration: 15 });
    onEndRecord(response);

    handleClose();
  };

  const onStartRecording = () => {
    setVideoState('RECORDING');
    setCountdownTime(15);
  };

  const endRecording = () => camera.current?.stopRecording();

  const handleClose = () => dispatch(navigateBack());

  const handleFlipCamera = () =>
    setCameraType(cameraType === 'front' ? 'back' : 'front');

  const renderCloseButton = () => (
    <SafeAreaView style={styles.closeWrap}>
      {videoState === 'NOT_RECORDING' ? (
        <Touchable
          testID="CloseButton"
          onPress={handleClose}
          // @ts-ignore
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
        <Touchable testID="FlipCameraButton" onPress={handleFlipCamera}>
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
        onRecordingStart={onStartRecording}
        androidCameraPermissionOptions={t('cameraPermissions')}
        androidRecordAudioPermissionOptions={t('audioPermissions')}
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
