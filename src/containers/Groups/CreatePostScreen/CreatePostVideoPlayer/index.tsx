import React, { useState } from 'react';
import { View } from 'react-native';

import TrashIcon from '../../../../../assets/images/trashIcon.svg';
import PlayButton from '../../../../../assets/images/playIcon.svg';
import { Touchable } from '../../../../components/common';
import VideoPlayer from '../../../../components/VideoPlayer';
import theme from '../../../../theme';

import styles from './styles';

interface CreatePostVideoPlayerProps {
  uri: string;
  onDelete: () => void;
}

export const CreatePostVideoPlayer = ({
  uri,
  onDelete,
}: CreatePostVideoPlayerProps) => {
  const [paused, setPaused] = useState(true);

  const togglePaused = () => setPaused(!paused);

  const renderVideoPlayerControls = () => (
    <View style={styles.controlWrap}>
      <View style={styles.buttonWrap}>
        <Touchable
          testID="FullScreenButton"
          onPress={onDelete}
          style={[styles.cornerButton, styles.grayButton]}
        >
          <TrashIcon color={theme.white} height={24} width={24} />
        </Touchable>
        <Touchable
          testID="DeleteButton"
          onPress={onDelete}
          style={[styles.cornerButton, styles.redButton]}
        >
          <TrashIcon color={theme.white} height={24} width={24} />
        </Touchable>
      </View>
      <View style={styles.centerWrap}>
        <Touchable
          testID="PlayButton"
          style={[styles.playButton, styles.grayButton]}
          onPress={togglePaused}
        >
          <PlayButton />
        </Touchable>
      </View>
      <View style={styles.buttonWrap}>
        <Touchable
          testID="Button"
          onPress={onDelete}
          style={[styles.cornerButton, styles.grayButton]}
        >
          <TrashIcon color={theme.white} height={24} width={24} />
        </Touchable>
        <Touchable
          testID="MuteButton"
          onPress={onDelete}
          style={[styles.cornerButton, styles.grayButton]}
        >
          <TrashIcon color={theme.white} height={24} width={24} />
        </Touchable>
      </View>
    </View>
  );

  return (
    <VideoPlayer
      uri={uri}
      customControls={renderVideoPlayerControls()}
      paused={paused}
      width={theme.fullWidth}
    />
  );
};
