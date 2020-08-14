import React, { useState } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-navigation';

import TrashIcon from '../../../assets/images/trashIcon.svg';
import PlayButton from '../../../assets/images/playIcon.svg';
import CloseButton from '../../../assets/images/closeButton.svg';
import { Touchable, Text } from '../common';
import theme from '../../theme';

import styles from './styles';

interface VideoPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  onDelete?: () => void;
  width?: number;
}

const VideoPlayer = ({ uri, style, onDelete, width }: VideoPlayerProps) => {
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const togglePaused = () => setPaused(!paused);

  const toggleFullscreen = () => setFullscreen(!fullscreen);

  const toggleMuted = () => setMuted(!muted);

  const ratio = 16.0 / 9.0;
  const height = (width && ratio * width) || 300;

  const renderPauseButton = () => (
    <Touchable
      testID="RecordButton"
      style={styles.pausePlayButton}
      onPress={togglePaused}
    >
      {paused ? <PlayIcon /> : <PauseIcon />}
    </Touchable>
  );

  const renderFullScreen = () => (
    <View style={styles.fullScreenContainer}>
      <SafeAreaView style={styles.closeWrap}>
        <Touchable
          testID="CloseButton"
          onPress={toggleFullscreen}
          style={styles.closeButton}
        >
          <CloseButton color={theme.white} height={36} width={36} />
        </Touchable>
      </SafeAreaView>
      <SafeAreaView style={styles.controlBarBackground}>
        <View style={styles.controlBarWrap}>
          <View style={styles.countdownTextWrap}>
            <Text style={styles.countdownText}>:15</Text>
          </View>
          {renderPauseButton()}
          <Touchable testID="FlipCameraButton" onPress={toggleMuted}>
            <MuteIcon />
          </Touchable>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderSmallScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Touchable
        testID="DeleteButton"
        onPress={onDelete}
        style={styles.deleteButton}
      >
        <TrashIcon />
      </Touchable>
      <Touchable
        testID="PlayButton"
        style={{
          margin: 16,
          paddingLeft: 24,
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#00000066',
        }}
        onPress={togglePaused}
      >
        <PlayButton />
      </Touchable>
    </View>
  );

  return (
    <View style={[styles.videoContainer, { height }, style]}>
      <Video
        source={{ uri }}
        controls={false}
        paused={paused}
        style={styles.videoPlayer}
      />
      {fullscreen ? renderFullScreen() : renderSmallScreen()}
    </View>
  );
};

export default VideoPlayer;
