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
}

const VideoPlayer = ({ uri, style, onDelete }: VideoPlayerProps) => {
  const dispatch = useDispatch();

  const openFullScreen = () => {
    dispatch(navigatePush(VIDEO_FULL_SCREEN, { uri }));
  };

  return (
    <View style={[styles.videoContainer, style]}>
      <Video
        testID="Video"
        resizeMode={'cover'}
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
