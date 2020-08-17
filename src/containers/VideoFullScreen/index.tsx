import React, { useState } from 'react';
import { View } from 'react-native';
import Video, { OnProgressData } from 'react-native-video';
import { SafeAreaView } from 'react-navigation';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';

import CloseButton from '../../../assets/images/closeIcon.svg';
import { navigateBack } from '../../actions/navigation';
import { Touchable, Text } from '../../components/common';
import theme from '../../theme';

import PlayIconEmpty from './playIconEmpty.svg';
import PauseIcon from './pauseIcon.svg';
import MutedIcon from './mutedIcon.svg';
import UnmutedIcon from './unmutedIcon.svg';
import styles from './styles';

interface VideFullScreenNavParams {
  uri: string;
}

export const VideoFullScreen = () => {
  const dispatch = useDispatch();
  const uri: string = useNavigationParam('uri');

  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [countdownTime, setCountdownTime] = useState<number>(0);

  const togglePaused = () => setPaused(!paused);

  const toggleMuted = () => setMuted(!muted);

  const handleClose = () => dispatch(navigateBack());

  const handleProgress = ({
    currentTime,
    seekableDuration,
  }: OnProgressData) => {
    setCountdownTime(Math.ceil(seekableDuration - currentTime));
  };

  const renderPauseButton = () => (
    <Touchable
      testID="PausePlayButton"
      style={styles.pausePlayButton}
      onPress={togglePaused}
    >
      {paused ? (
        <PlayIconEmpty testID="PlayIconEmpty" />
      ) : (
        <PauseIcon testID="PauseIcon" />
      )}
    </Touchable>
  );

  const renderMuteButton = () => (
    <Touchable testID="MutedButton" onPress={toggleMuted}>
      {muted ? (
        <MutedIcon testID="MutedIcon" />
      ) : (
        <UnmutedIcon testID="UnmutedIcon" />
      )}
    </Touchable>
  );

  return (
    <View style={styles.container}>
      <Video
        source={{ uri }}
        resizeMode={'cover'}
        controls={false}
        paused={paused}
        muted={muted}
        style={styles.videoPlayer}
        onEnd={handleClose}
        onProgress={handleProgress}
      />
      <View style={styles.controlsContainer}>
        <SafeAreaView style={styles.closeWrap}>
          <Touchable
            testID="CloseButton"
            onPress={handleClose}
            style={styles.closeButton}
          >
            <CloseButton color={theme.white} height={36} width={36} />
          </Touchable>
        </SafeAreaView>
        <SafeAreaView style={styles.controlBarBackground}>
          <View style={styles.controlBarWrap}>
            <View style={styles.countdownTextWrap}>
              <Text style={styles.countdownText}>{`:${countdownTime}`}</Text>
            </View>
            {renderPauseButton()}
            {renderMuteButton()}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export const VIDEO_FULL_SCREEN = 'nav/VIDEO_FULL_SCREEN';
