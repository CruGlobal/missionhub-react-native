import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Video from 'react-native-video';
import { useDispatch } from 'react-redux';

import TrashIcon from '../../../assets/images/trashIcon.svg';
import PlayIconFull from '../../../assets/images/playIconFull.svg';
import { navigatePush } from '../../actions/navigation';
import { Touchable } from '../common';
import { VIDEO_FULL_SCREEN } from '../../containers/VideoFullScreen';

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
      />
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
          onPress={openFullScreen}
        >
          <PlayIconFull />
        </Touchable>
      </View>
    </View>
  );
};

export default VideoPlayer;
