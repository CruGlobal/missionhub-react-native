import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';

import TrashIcon from '../../../assets/images/trashIcon.svg';
import { Touchable } from '../common';
import theme from '../../theme';

import styles from './styles';

interface VideoPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  customControls?: ReactElement;
  onDelete?: () => void;
  width?: number;
}

const VideoPlayer = ({
  uri,
  style,
  customControls,
  onDelete,
  width,
}: VideoPlayerProps) => {
  const ratio = 16.0 / 9.0;
  const height = (width && ratio * width) || 300;

  return (
    <View style={[styles.videoContainer, { height }, style]}>
      <Video
        source={{ uri }}
        controls={!customControls}
        paused={true}
        style={styles.videoPlayer}
      />
      {customControls ? (
        <View style={styles.controlsWrap}>{customControls}</View>
      ) : null}
    </View>
  );
};

export default VideoPlayer;
