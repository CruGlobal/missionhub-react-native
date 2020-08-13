import React, { useState } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';

import TrashIcon from '../../../assets/images/trashIcon.svg';
import PlayButton from '../../../assets/images/playIcon.svg';
import { Touchable } from '../common';
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

  const renderSmallScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Touchable
        testID="DeleteButton"
        onPress={onDelete}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.red,
        }}
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

  const renderFullScreen = () => <View></View>;

  const renderVideoPlayerControls = () =>
    fullscreen ? renderFullScreen() : renderSmallScreen();

  return (
    <View style={[styles.videoContainer, { height }, style]}>
      <Video
        source={{ uri }}
        controls={false}
        paused={paused}
        style={styles.videoPlayer}
      />
      {renderVideoPlayerControls()}
    </View>
  );
};

export default VideoPlayer;
