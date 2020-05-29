import React from 'react';
import Video from 'react-native-video';

import { Flex } from '../common';

import styles from './styles';

const VideoPlayer = ({ uri }: { uri: string }) => {
  return (
    <Flex style={styles.videoContainer}>
      <Video
        source={{
          uri,
        }}
        controls={true}
        paused={true}
        style={styles.videoPlayer}
      />
    </Flex>
  );
};
export default VideoPlayer;
