import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';
import { useDispatch } from 'react-redux';

import { navigatePush } from '../../actions/navigation';
import { Touchable } from '../common';
import { VIDEO_FULL_SCREEN } from '../../containers/VideoFullScreen';

import TrashIcon from './trashIcon.svg';
import PlayIconFull from './playIconFull.svg';
import styles from './styles';

interface VideoPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  onDelete?: () => void;
  width?: number;
}

const VideoPlayer = ({ uri, style, onDelete, width }: VideoPlayerProps) => {
  const dispatch = useDispatch();

  const openFullScreen = () => {
    dispatch(navigatePush(VIDEO_FULL_SCREEN, { uri }));
  };

  const ratio = 16.0 / 9.0;
  const height = (width && ratio * width) || 300;

  return (
    <View style={[styles.videoContainer, { height }, style]}>
      <Video
        source={{ uri }}
        controls={false}
        paused={true}
        style={styles.videoPlayer}
        ignoreSilentSwitch="ignore"
      />
      <Touchable
        testID="ControlsWrap"
        style={styles.controlsWrap}
        onPress={openFullScreen}
      >
        {onDelete ? (
          <Touchable
            testID="DeleteButton"
            onPress={onDelete}
            style={styles.deleteButton}
          >
            <TrashIcon />
          </Touchable>
        ) : null}
        <View style={styles.playButton}>
          <PlayIconFull />
        </View>
      </Touchable>
    </View>
  );
};

export default VideoPlayer;
