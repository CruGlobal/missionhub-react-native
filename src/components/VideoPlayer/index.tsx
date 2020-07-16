import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';

import TrashIcon from '../../../assets/images/trashIcon.svg';
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
  const ratio = 16.0 / 9.0;
  const height = (width && ratio * width) || 300;

  const renderDeleteButton = () =>
    onDelete ? (
      <View style={styles.deleteWrap}>
        <Touchable
          testID="DeleteButton"
          onPress={onDelete}
          type="transparent"
          style={styles.deleteButton}
        >
          <TrashIcon color={theme.white} height={24} width={24} />
        </Touchable>
      </View>
    ) : null;

  return (
    <View style={[styles.videoContainer, { height }, style]}>
      <Video
        source={{
          uri,
        }}
        controls={true}
        paused={true}
        style={styles.videoPlayer}
      />
      {renderDeleteButton()}
    </View>
  );
};

export default VideoPlayer;
