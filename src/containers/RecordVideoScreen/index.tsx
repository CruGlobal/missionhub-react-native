import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { RNCamera } from 'react-native-camera';

import { navigateBack } from '../../actions/navigation';
import { Text, Button, Touchable } from '../../components/common';
import CloseButton from '../../../assets/images/closeIcon.svg';
import theme from '../../theme';

import CameraRotateIcon from './cameraRotateIcon.svg';
import styles from './styles';

const { front: FrontCamera, back: BackCamera } = RNCamera.Constants.Type;
type CameraType = typeof FrontCamera | typeof BackCamera;
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
  const [cameraType, setCameraType] = useState<CameraType>(FrontCamera);

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
    setVideoState('RECORDING');
    if (camera.current) {
      const { uri } = await camera.current.recordAsync();

      onEndRecord(uri);
    }
    startCountdown();
  };

  const endRecording = () => {
    setVideoState('NOT_RECORDING');
    camera.current?.stopRecording();
    dispatch(navigateBack());
    endCountdown();
  };

  const handleClose = () => dispatch(navigateBack());

  const handleFlipCamera = () =>
    setCameraType(cameraType === FrontCamera ? BackCamera : FrontCamera);

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
    <View>
      <View style={styles.controlBarBackground} />
      <SafeAreaView>
        <View style={styles.controlBarContainer}>
          <View style={{ borderWidth: 1, width: 40, alignItems: 'flex-start' }}>
            <Text style={styles.countdownText}>{`:${countdownTime}`}</Text>
          </View>
          {renderRecordButton()}
          <Touchable onPress={handleFlipCamera}>
            <CameraRotateIcon />
          </Touchable>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <RNCamera
        type={cameraType}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderCameraView()}
      {renderCloseButton()}
      {renderControlBar()}
    </View>
  );
};

export const RECORD_VIDEO_SCREEN = 'nav/RECORD_VIDEO_SCREEN';
