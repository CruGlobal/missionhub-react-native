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
  const [countDownTime, setCountdownTime] = useState<number>(15);
  const [cameraType, setCameraType] = useState<CameraType>(FrontCamera);

  let interval: NodeJS.Timer | null = null;

  useEffect(() => {
    if (interval && countDownTime === 0) {
      console.log('countdown is zero');
      endRecording();
    }

    return endCountdown;
  }, [countDownTime]);

  const startCountdown = () => {
    console.log('start countdown');
    setCountdownTime(15);
    interval = setInterval(() => setCountdownTime(countDownTime - 1), 1000);
  };

  const endCountdown = () => {
    console.log('end countdown');
    interval && clearInterval(interval);
  };

  const startRecording = async () => {
    setVideoState('RECORDING');
    console.log('start recording');
    /*if (camera.current) {
      const { uri } = await camera.current.recordAsync();

      onEndRecord(uri);
    }*/
    startCountdown();
  };

  const endRecording = () => {
    setVideoState('NOT_RECORDING');
    console.log('end recording');
    /*camera.current?.stopRecording();
    dispatch(navigateBack());*/
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
          <Text style={styles.countdownText}>{`:${countDownTime}`}</Text>
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
