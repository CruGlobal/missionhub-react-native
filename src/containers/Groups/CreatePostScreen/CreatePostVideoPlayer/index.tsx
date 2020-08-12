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
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: theme.fullWidth,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Touchable
          testID="DeleteButton"
          onPress={onDelete}
          // @ts-ignore
          type="transparent"
          style={styles.deleteButton}
        >
          <TrashIcon color={theme.white} height={24} width={24} />
        </Touchable>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Touchable style={styles.playButton} onPress={togglePaused}>
          <PlayButton />
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
