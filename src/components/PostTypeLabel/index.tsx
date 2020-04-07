import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import { Text } from '../common';
import { TouchablePress } from '../Touchable/index.ios';
import AnnouncementIcon from '../../../assets/images/announcementIcon.svg';
import CareRequestIcon from '../../../assets/images/careRequestIcon.svg';
import ChallengesIcon from '../../../assets/images/challengesIcon.svg';
import GodStoryIcon from '../../../assets/images/godStoryIcon.svg';
import OnYourMindIcon from '../../../assets/images/onYourMindIcon.svg';
import PrayerRequestIcon from '../../../assets/images/prayerRequestIcon.svg';
import SpiritualQuestionIcon from '../../../assets/images/spiritualQuestionIcon.svg';
import StepsOfFaithIcon from '../../../assets/images/stepsOfFaithIcon.svg';
import theme from '../../theme';

import styles from './styles';

export enum PostTypeEnum {
  godStory = 'godStory',
  prayerRequest = 'prayerRequest',
  spiritualQuestion = 'spiritualQuestion',
  careRequest = 'careRequest',
  onYourMind = 'onYourMind',
  challenge = 'challenge',
  announcement = 'announcement',
  stepOfFatih = 'stepOfFaith',
}

interface PostTypeLabelProps {
  type: PostTypeEnum;
  onPress?: TouchablePress;
  showText?: boolean;
  isModal?: boolean;
}

const PostTypeLabel = ({
  type,
  onPress,
  isModal = false,
  showText = true,
}: PostTypeLabelProps) => {
  const { t } = useTranslation('postTypes');

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };
  // IconSize differs if it is inside the create post modal component
  const iconSize = isModal ? 24 : 20;

  const renderIcon = () => {
    switch (type) {
      case PostTypeEnum.godStory:
        return (
          <GodStoryIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );
      case PostTypeEnum.prayerRequest:
        return (
          <PrayerRequestIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case PostTypeEnum.spiritualQuestion:
        return (
          <SpiritualQuestionIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case PostTypeEnum.careRequest:
        return (
          <CareRequestIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case PostTypeEnum.onYourMind:
        return (
          <OnYourMindIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case PostTypeEnum.challenge:
        return (
          <ChallengesIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case PostTypeEnum.announcement:
        return (
          <AnnouncementIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case PostTypeEnum.stepOfFatih:
        return (
          <StepsOfFaithIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );
    }
  };

  return (
    <Button
      onPress={handlePress}
      testID={`${type}Button`}
      pill={true}
      style={[
        styles.button,
        styles[type],
        isModal ? styles.modalSize : null,
        showText ? null : styles.noText,
      ]}
    >
      {renderIcon()}
      {showText ? <Text style={styles.buttonText}>{t(`${type}`)}</Text> : null}
    </Button>
  );
};

export default PostTypeLabel;
