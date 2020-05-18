import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TouchablePress } from '../Touchable/index.ios';
import AnnouncementIcon from '../../../assets/images/announcementIcon.svg';
import CareRequestIcon from '../../../assets/images/careRequestIcon.svg';
import ChallengesIcon from '../../../assets/images/challengesIcon.svg';
import GodStoryIcon from '../../../assets/images/godStoryIcon.svg';
import OnYourMindIcon from '../../../assets/images/onYourMindIcon.svg';
import PrayerRequestIcon from '../../../assets/images/prayerRequestIcon.svg';
import SpiritualQuestionIcon from '../../../assets/images/spiritualQuestionIcon.svg';
import StepsOfFaithIcon from '../../../assets/images/stepsOfFaithIcon.svg';
import { Card, Flex, Text, Button } from '../common';
import DeprecatedBackButton from '../../containers/DeprecatedBackButton';
import ReportedIcon from '../../../assets/images/reportedIcon.svg';
import CommentIcon from '../../../assets/images/commentIcon.svg';
import theme from '../../theme';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';

export enum PostTypeEnum {
  reported = 'reported',
  comment = 'comment',
}

export enum PostLabelSizeEnum {
  small = 'small',
  normal = 'normal',
  large = 'large',
  extraLarge = 'extraLarge',
}

interface PostTypeLabelProps {
  type: FeedItemSubjectTypeEnum | PostTypeEnum;
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
      : size === PostLabelSizeEnum.small
      ? 12
      : 24;

  const renderIcon = () => {
    switch (type) {
      case FeedItemSubjectTypeEnum.STORY:
        return (
          <GodStoryIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );
      case FeedItemSubjectTypeEnum.PRAYER_REQUEST:
        return (
          <PrayerRequestIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );

      case FeedItemSubjectTypeEnum.QUESTION:
        return (
          <SpiritualQuestionIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );

      case FeedItemSubjectTypeEnum.HELP_REQUEST:
        return (
          <CareRequestIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );

      case FeedItemSubjectTypeEnum.THOUGHT:
        return (
          <OnYourMindIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );

      case FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE:
        return (
          <ChallengesIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );

      case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
        return (
          <AnnouncementIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );

      case FeedItemSubjectTypeEnum.STEP:
        return (
          <StepsOfFaithIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );
      case PostTypeEnum.reported:
        return (
          <ReportedIcon
            color={theme.red}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
          />
        );
      case PostTypeEnum.comment:
        return (
          <CommentIcon
            color={theme.white}
            width={iconSize}
            height={iconSize}
            style={showText ? styles.icon : null}
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
            <DeprecatedBackButton />
          </Flex>
        </Card>
      );
    } else if (size === PostLabelSizeEnum.small) {
      return (
        <View style={[styles[type], styles.smallSize]}>{renderIcon()}</View>
      );
    } else {
      return (
        <Button
          onPress={handlePress}
          testID={`${type}Button`}
          pill={true}
          style={[
            showText ? styles.buttonWithText : styles.button,
            styles[type],
            showText ? null : styles.noText,
            size === PostLabelSizeEnum.large ? styles.largeSize : null,
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
