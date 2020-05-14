import React from 'react';
import { View } from 'react-native';
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
import DeprecatedBackButton from '../../containers/DeprecatedBackButton';
import theme from '../../theme';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';

export enum PostLabelSizeEnum {
  normal = 'normal',
  large = 'large',
  extraLarge = 'extraLarge',
}

interface PostTypeLabelProps {
  type: FeedItemSubjectTypeEnum;
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
      case FeedItemSubjectTypeEnum.STORY:
        return (
          <GodStoryIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );
      case FeedItemSubjectTypeEnum.PRAYER_REQUEST:
        return (
          <PrayerRequestIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case FeedItemSubjectTypeEnum.QUESTION:
        return (
          <SpiritualQuestionIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case FeedItemSubjectTypeEnum.HELP_REQUEST:
        return (
          <CareRequestIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case FeedItemSubjectTypeEnum.THOUGHT:
        return (
          <OnYourMindIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE:
        return (
          <ChallengesIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
        return (
          <AnnouncementIcon
            color={theme.white}
            style={styles.icon}
            width={iconSize}
            height={iconSize}
          />
        );

      case FeedItemSubjectTypeEnum.STEP:
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

  return size === PostLabelSizeEnum.extraLarge ? (
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
        <DeprecatedBackButton />
      </Flex>
    </Card>
  ) : onPress ? (
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
      {showText ? <Text style={styles.buttonText}>{t(`${type}`)}</Text> : null}
    </Button>
  ) : (
    <View
      testID={`${type}Label`}
      style={[
        styles.button,
        styles[type],
        size === PostLabelSizeEnum.large ? styles.largeSize : null,
        showText ? null : styles.noText,
      ]}
    >
      {renderIcon()}
      {showText ? <Text style={styles.buttonText}>{t(`${type}`)}</Text> : null}
    </View>
  );
};

export default PostTypeLabel;
