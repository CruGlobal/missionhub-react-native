import React from 'react';
import { SafeAreaView, StyleProp, ViewStyle, View } from 'react-native';
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
import theme from '../../theme';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import Avatar from '../Avatar';
import { FeedItemPostCard_author } from '../../containers/CelebrateFeedPostCards/__generated__/FeedItemPostCard';
import { FeedItemStepCard_owner } from '../../containers/CelebrateFeedPostCards/__generated__/FeedItemStepCard';

import styles from './styles';

export enum PostLabelSizeEnum {
  small = 'small',
  normal = 'normal',
  large = 'large',
  extraLarge = 'extraLarge',
}

export const PostTypeBgStyle: {
  [key in FeedItemSubjectTypeEnum]: StyleProp<ViewStyle>;
} = {
  ANNOUNCEMENT: styles.ANNOUNCEMENT,
  COMMUNITY_CHALLENGE: styles.COMMUNITY_CHALLENGE,
  HELP_REQUEST: styles.HELP_REQUEST,
  PRAYER_REQUEST: styles.PRAYER_REQUEST,
  QUESTION: styles.QUESTION,
  STEP: styles.STEP,
  STORY: styles.STORY,
  THOUGHT: styles.THOUGHT,
};

interface PostTypeIconProps {
  type: FeedItemSubjectTypeEnum;
  size: PostLabelSizeEnum;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function PostTypeIcon({ type, size, color, style }: PostTypeIconProps) {
  const iconSize =
    size === PostLabelSizeEnum.extraLarge
      ? 72
      : size === PostLabelSizeEnum.large
      ? 24
      : 20;
  const iconProps = {
    color: color || theme.white,
    style: [styles.icon, style],
    width: iconSize,
    height: iconSize,
  };
  switch (type) {
    case FeedItemSubjectTypeEnum.STORY:
      return <GodStoryIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.PRAYER_REQUEST:
      return <PrayerRequestIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.QUESTION:
      return <SpiritualQuestionIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.HELP_REQUEST:
      return <CareRequestIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.THOUGHT:
      return <OnYourMindIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE:
      return <ChallengesIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
      return <AnnouncementIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.STEP:
      return <StepsOfFaithIcon {...iconProps} />;
  }
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

  if (size === PostLabelSizeEnum.extraLarge) {
    return (
      <SafeAreaView style={[styles[type]]}>
        <Card style={[styles.headerCard, styles[type], { shadowOpacity: 0 }]}>
          <Flex
            value={1}
            align="center"
            justify="center"
            style={styles.headerContainer}
          >
            <PostTypeIcon type={type} size={size} />
            <Text style={styles.headerText}>{t(`header.${type}`)}</Text>
          </Flex>
          <Flex style={styles.headerBackButtonWrap}>
            <DeprecatedBackButton />
          </Flex>
        </Card>
      </SafeAreaView>
    );
  }
  if (onPress) {
    return (
      <Button
        onPress={() => onPress && onPress()}
        testID={`${type}Button`}
        pill={true}
        style={[
          styles.button,
          styles[type],
          size === PostLabelSizeEnum.large ? styles.largeSize : null,
          showText ? null : styles.noText,
        ]}
      >
        <PostTypeIcon type={type} size={size} />
        {showText ? (
          <Text style={styles.buttonText}>{t(`${type}`)}</Text>
        ) : null}
      </Button>
    );
  }

  return (
    <View
      testID={`${type}Label`}
      style={[
        styles.button,
        styles[type],
        size === PostLabelSizeEnum.large ? styles.largeSize : null,
        showText ? null : styles.noText,
      ]}
    >
      <PostTypeIcon type={type} size={size} />
      {showText ? <Text style={styles.buttonText}>{t(`${type}`)}</Text> : null}
    </View>
  );
};

const SHOW_PEOPLE = 3;
function getExtraCount(numPeople = 0, countOnly = false) {
  let num = countOnly ? numPeople : numPeople - SHOW_PEOPLE;
  num = num <= 0 ? 0 : num;
  if (num > 9) {
    num = 9;
  }
  return num;
}

interface PostTypeCardWithPeopleProps {
  type: FeedItemSubjectTypeEnum;
  onPress: TouchablePress;
  people?: (FeedItemPostCard_author | FeedItemStepCard_owner)[];
  countOnly?: boolean;
  testID?: string;
}
export const PostTypeCardWithPeople = ({
  type,
  onPress,
  people,
  countOnly = false,
}: PostTypeCardWithPeopleProps) => {
  const { t } = useTranslation('postTypes');
  const visiblePeople = people?.slice(0, 3) || [];
  const num = getExtraCount(people?.length, countOnly);

  return (
    <Card
      testID={`${type}CardWithPeople`}
      onPress={onPress}
      style={styles.peopleCard}
    >
      <View style={[styles[type], styles.peopleCardTop]}>
        <PostTypeIcon
          type={type}
          size={PostLabelSizeEnum.large}
          style={{ marginLeft: 0, marginRight: 0 }}
        />
        <View style={styles.peopleCardList}>
          {!countOnly &&
            visiblePeople.map((person, index) => (
              <Avatar
                // eslint-disable-next-line react/no-array-index-key
                key={`${person.id}-${index}`}
                person={person}
                size="extrasmall"
                style={{ marginLeft: -12 }}
              />
            ))}
          {num > 0 && (
            <Avatar
              person={null}
              customText={`+${num}`}
              size="extrasmall"
              style={[styles[type], { marginLeft: -12 }]}
            />
          )}
        </View>
      </View>
      <View style={styles.peopleCardBottom}>
        <Text style={styles.peopleCardText}>{t(`card.${type}`)}</Text>
      </View>
    </Card>
  );
};

export default PostTypeLabel;
