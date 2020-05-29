import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Video from 'react-native-video';

import { Flex } from '../common';

import styles from './styles';

interface VideoPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
}

const VideoPlayer = ({ uri, style }: VideoPlayerProps) => {
  return (
    <Flex style={styles.videoContainer}>
      <Video
        source={{
          uri,
        }}
        controls={true}
        paused={true}
        style={[styles.videoPlayer, style]}
      />
    </Flex>
  );
};
export default VideoPlayer;
