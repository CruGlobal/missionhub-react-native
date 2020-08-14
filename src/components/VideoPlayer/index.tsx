import React, { useState } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-navigation';

import TrashIcon from '../../../assets/images/trashIcon.svg';
import PlayIconFull from '../../../assets/images/playIconFull.svg';
import PlayIconEmpty from '../../../assets/images/playIconEmpty.svg';
import PauseIcon from '../../../assets/images/pauseIcon.svg';
import MutedIcon from '../../../assets/images/mutedIcon.svg';
import UnmutedIcon from '../../../assets/images/unmutedIcon.svg';
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

  const toggleMuted = () => setMuted(!muted);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setPaused(fullscreen);
  };

  const ratio = 16.0 / 9.0;
  const height = (width && ratio * width) || 300;

  const renderPauseButton = () => (
    <Touchable
      testID="PausePlayButton"
      style={styles.pausePlayButton}
      onPress={togglePaused}
    >
      {paused ? <PlayIconEmpty /> : <PauseIcon />}
    </Touchable>
  );

  const renderMuteButton = () => (
    <Touchable testID="MutedButton" onPress={toggleMuted}>
      {muted ? MutedIcon : UnmutedIcon}
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
          {renderMuteButton()}
        </View>
      </SafeAreaView>
    </View>
  );

  const renderSmallScreen = () => (
    <View style={styles.smallScreenWrap}>
      {onDelete ? (
        <Touchable
          testID="DeleteButton"
          onPress={onDelete}
          style={styles.deleteButton}
        >
          <TrashIcon />
        </Touchable>
      ) : null}
      <Touchable
        testID="PlayButton"
        style={styles.playButton}
        onPress={toggleFullscreen}
      >
        <PlayIconFull />
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
