import React, { useState } from 'react';
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

const VideoPlayer = ({
  uri,
  style,
  onDelete,
  width: startWidth,
}: VideoPlayerProps) => {
  const dispatch = useDispatch();

  const [videoWidth, setVideoWidth] = useState(startWidth || 0);
  const [videoHeight, setVideoHeight] = useState(0);

  const openFullScreen = () => {
    dispatch(navigatePush(VIDEO_FULL_SCREEN, { uri }));
  };

  return (
    <View
      style={[
        styles.videoContainer,
        { width: videoWidth, height: videoHeight },
        style,
      ]}
    >
      <Video
        testID="Video"
        source={{ uri }}
        controls={false}
        paused={true}
        style={styles.videoPlayer}
        ignoreSilentSwitch="ignore"
        onLoad={response => {
          //Not sure why, but it looks like width and height are the opposite of what they should be
          const { width: _height, height: _width } = response.naturalSize;

          const width = videoWidth != 0 ? videoWidth : _width;
          videoWidth === 0 && setVideoWidth(_width);

          setVideoHeight(_height * (width / _width));
        }}
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
