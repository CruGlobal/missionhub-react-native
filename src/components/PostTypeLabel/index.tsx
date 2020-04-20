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
import { Card, Flex } from '../common';
import BackButton from '../../containers/BackButton';
import theme from '../../theme';
import { PostTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';

export enum communityFeedTypeEnum {
  story = 'story',
  prayer_request = 'prayer_request',
  question = 'question',
  help_request = 'help_request',
  thought = 'thought',
  challenge = 'challenge',
  announcement = 'announcement',
  stepOfFatih = 'stepOfFaith',
}

export enum PostLabelSizeEnum {
  normal = 'normal',
  large = 'large',
  extraLarge = 'extraLarge',
}

interface PostTypeLabelProps {
  type: communityFeedTypeEnum | PostTypeEnum;
  onPress?: TouchablePress;
  showText?: boolean;
  size?: PostLabelSizeEnum;
}

const PostTypeLabel = ({
  type,
  onPress,
  size = PostLabelSizeEnum.normal,
  showText = true,
}: PostTypeLabelProps) => {
  const { t } = useTranslation('postTypes');

  const handlePress = () => onPress && onPress();

  const iconSize =
    size === PostLabelSizeEnum.extraLarge
      ? 72
      : size === PostLabelSizeEnum.large
      ? 24
      : 20;

  const renderIcon = () => {
    switch (type) {
      case communityFeedTypeEnum.story:
        return (
          <GodStoryIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );
      case communityFeedTypeEnum.prayer_request:
        return (
          <PrayerRequestIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case communityFeedTypeEnum.question:
        return (
          <SpiritualQuestionIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case communityFeedTypeEnum.help_request:
        return (
          <CareRequestIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case communityFeedTypeEnum.thought:
        return (
          <OnYourMindIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case communityFeedTypeEnum.challenge:
        return (
          <ChallengesIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case communityFeedTypeEnum.announcement:
        return (
          <AnnouncementIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case communityFeedTypeEnum.stepOfFatih:
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

  const renderContent = () => {
    if (size === PostLabelSizeEnum.extraLarge) {
      return (
        <Card style={[styles.headerCard, styles[type]]}>
          <Flex
            value={1}
            align="center"
            justify="center"
            style={styles.headerContainer}
          >
            {renderIcon()}
            <Text style={styles.headerText}>{t(`header.${type}`)}</Text>
          </Flex>
          <Flex style={styles.headerBackButtonWrap}>
            <BackButton />
          </Flex>
        </Card>
      );
    } else {
      return (
        <Button
          onPress={handlePress}
          testID={`${type}Button`}
          pill={true}
          style={[
            styles.button,
            styles[type],
            size === PostLabelSizeEnum.large ? styles.largeSize : null,
            showText ? null : styles.noText,
          ]}
        >
          {renderIcon()}
          {showText ? (
            <Text style={styles.buttonText}>{t(`${type}`)}</Text>
          ) : null}
        </Button>
      );
    }
  };

  return renderContent();
};

export default PostTypeLabel;
