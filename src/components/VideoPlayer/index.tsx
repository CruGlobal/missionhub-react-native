import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';

import TrashIcon from '../../../assets/images/trashIcon.svg';
import { Flex, Touchable } from '../common';
import theme from '../../theme';

import styles from './styles';

interface VideoPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  onDelete?: () => void;
}

const VideoPlayer = ({ uri, style, onDelete }: VideoPlayerProps) => {
  const renderDeleteButton = () =>
    onDelete ? (
      <View style={styles.deleteWrap}>
        <Touchable
          onPress={onDelete}
          type="transparent"
          style={styles.deleteButton}
        >
          <TrashIcon color={theme.white} height={24} width={24} />
        </Touchable>
      </View>
    ) : null;

  return (
    <View style={[styles.videoContainer, style]}>
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
