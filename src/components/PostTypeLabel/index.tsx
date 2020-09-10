import React, { ReactElement } from 'react';
import {
  SafeAreaView,
  StyleProp,
  ViewStyle,
  View,
  GestureResponderEvent,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import { Card } from '../common';
import AnnouncementIcon from '../../../assets/images/announcementIcon.svg';
import CareRequestIcon from '../../../assets/images/careRequestIcon.svg';
import ChallengesIcon from '../../../assets/images/challengesIcon.svg';
import GodStoryIcon from '../../../assets/images/godStoryIcon.svg';
import OnYourMindIcon from '../../../assets/images/onYourMindIcon.svg';
import PrayerRequestIcon from '../../../assets/images/prayerRequestIcon.svg';
import SpiritualQuestionIcon from '../../../assets/images/spiritualQuestionIcon.svg';
import StepsOfFaithIcon from '../../../assets/images/stepsOfFaithIcon.svg';
import DeprecatedBackButton from '../../containers/DeprecatedBackButton';
import theme from '../../theme';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import Avatar, { AvatarPerson } from '../Avatar';
import Header from '../Header';

import styles from './styles';

export enum PostLabelSizeEnum {
  small = 'small',
  normal = 'normal',
  large = 'large',
  extraLarge = 'extraLarge',
}

const PostTypeBgStyle: {
  [key in FeedItemSubjectTypeEnum]: StyleProp<{ backgroundColor: string }>;
} = {
  ANNOUNCEMENT: styles.ANNOUNCEMENT,
  ACCEPTED_COMMUNITY_CHALLENGE: styles.ACCEPTED_COMMUNITY_CHALLENGE,
  COMMUNITY_CHALLENGE: null,
  COMMUNITY: null,
  COMMUNITY_PERMISSION: null,
  HELP_REQUEST: styles.HELP_REQUEST,
  PRAYER_REQUEST: styles.PRAYER_REQUEST,
  QUESTION: styles.QUESTION,
  STEP: styles.STEP,
  STORY: styles.STORY,
  THOUGHT: styles.THOUGHT,
};
const PostTypeColorStyle: {
  [key in FeedItemSubjectTypeEnum]: StyleProp<{ color: string }>;
} = {
  ANNOUNCEMENT: styles.colorANNOUNCEMENT,
  ACCEPTED_COMMUNITY_CHALLENGE: styles.colorACCEPTED_COMMUNITY_CHALLENGE,
  COMMUNITY_CHALLENGE: null,
  COMMUNITY: null,
  COMMUNITY_PERMISSION: null,
  HELP_REQUEST: styles.colorHELP_REQUEST,
  PRAYER_REQUEST: styles.colorPRAYER_REQUEST,
  QUESTION: styles.colorQUESTION,
  STEP: styles.colorSTEP,
  STORY: styles.colorSTORY,
  THOUGHT: styles.colorTHOUGHT,
};

interface PostTypeIconProps {
  type: FeedItemSubjectTypeEnum;
  size: PostLabelSizeEnum;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

function PostTypeIcon({ type, size, color, style }: PostTypeIconProps) {
  const iconSize =
    size === PostLabelSizeEnum.extraLarge
      ? 200
      : size === PostLabelSizeEnum.large
      ? 24
      : size === PostLabelSizeEnum.small
      ? 15
      : 20;
  const iconStyle =
    size === PostLabelSizeEnum.small ? styles.smallIcon : styles.icon;
  const iconProps = {
    color: color || theme.white,
    style: [iconStyle, style],
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
    case FeedItemSubjectTypeEnum.ACCEPTED_COMMUNITY_CHALLENGE:
      return <ChallengesIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
      return <AnnouncementIcon {...iconProps} />;
    case FeedItemSubjectTypeEnum.STEP:
      return <StepsOfFaithIcon {...iconProps} />;
    default:
      return null;
  }
}

type PostTypeLabelProps =
  | {
      type: FeedItemSubjectTypeEnum;
      onPress?: (event: GestureResponderEvent) => void;
      size?: Exclude<PostLabelSizeEnum, PostLabelSizeEnum.extraLarge>;
      showText?: boolean;
    }
  | {
      type: FeedItemSubjectTypeEnum;
      size: PostLabelSizeEnum.extraLarge;
      communityName: string;
      isGlobal: boolean;
    };

const PostTypeLabel = (props: PostTypeLabelProps) => {
  const { t } = useTranslation('postTypes');

  if (props.size === PostLabelSizeEnum.extraLarge) {
    const { type, size, communityName, isGlobal } = props;

    return (
      <SafeAreaView style={[PostTypeBgStyle[type]]}>
        <Card style={[styles.headerCard, PostTypeBgStyle[type]]}>
          <Header
            left={<DeprecatedBackButton />}
            title={communityName}
            style={styles.header}
            titleStyle={styles.headerTitle}
          />
          <View style={styles.headerContainer}>
            <PostTypeIcon type={type} size={size} style={styles.headerIcon} />
            <Text style={styles.headerText}>{t(`header.${type}`)}</Text>
            <Text style={styles.subheaderText}>
              {t(`${isGlobal ? 'globalSubheader' : 'subheader'}.${type}`)}
            </Text>
          </View>
        </Card>
      </SafeAreaView>
    );
  }

  const {
    type,
    onPress,
    size = PostLabelSizeEnum.normal,
    showText = true,
  } = props;

  if (onPress) {
    return (
      <Button
        onPress={onPress}
        testID={`${type}Button`}
        pill={true}
        style={[
          styles.button,
          PostTypeBgStyle[type],
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
        PostTypeBgStyle[type],
        showText ? null : styles.noText,
        size === PostLabelSizeEnum.large
          ? styles.largeSize
          : size === PostLabelSizeEnum.small
          ? styles.smallSize
          : null,
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

interface PostTypeCardProps {
  type: FeedItemSubjectTypeEnum;
  onPress: (event: GestureResponderEvent) => void;
  children: ReactElement | ReactElement[] | null;
}
const PostTypeCard = ({ type, onPress, children }: PostTypeCardProps) => {
  const { t } = useTranslation('postTypes');

  return (
    <Card
      testID={`${type}CardWithPeople`}
      onPress={onPress}
      style={styles.peopleCard}
    >
      <View style={[PostTypeBgStyle[type], styles.peopleCardTop]}>
        <PostTypeIcon
          type={type}
          size={PostLabelSizeEnum.large}
          style={{ marginLeft: 0, marginRight: 0 }}
        />
        <View style={styles.peopleCardList}>{children}</View>
      </View>
      <View style={styles.peopleCardBottom}>
        <Text style={styles.peopleCardText}>{t(`card.${type}`)}</Text>
      </View>
    </Card>
  );
};

interface PostTypeCardWithPeopleProps {
  type: FeedItemSubjectTypeEnum;
  onPress: (event: GestureResponderEvent) => void;
  people?: AvatarPerson[];
  testID?: string;
}
export const PostTypeCardWithPeople = ({
  type,
  onPress,
  people,
}: PostTypeCardWithPeopleProps) => {
  const visiblePeople = people?.slice(0, 3) || [];
  const num = getExtraCount(people?.length, false);

  return (
    <PostTypeCard type={type} onPress={onPress}>
      <>
        {visiblePeople.map((person, index) => (
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
            customText={`+${num}`}
            size="extrasmall"
            style={[PostTypeBgStyle[type], { marginLeft: -12 }]}
          />
        )}
      </>
    </PostTypeCard>
  );
};

interface PostTypeCardWithoutPeopleProps {
  type: FeedItemSubjectTypeEnum;
  onPress: (event: GestureResponderEvent) => void;
  postsCount: number;
  testID?: string;
}
export const PostTypeCardWithoutPeople = ({
  type,
  onPress,
  postsCount,
}: PostTypeCardWithoutPeopleProps) => {
  const num = getExtraCount(postsCount, true);

  return (
    <PostTypeCard type={type} onPress={onPress}>
      {(num > 0 && (
        <Avatar
          customText={`+${num}`}
          size="extrasmall"
          style={[PostTypeBgStyle[type], { marginLeft: -12 }]}
        />
      )) ||
        null}
    </PostTypeCard>
  );
};

export const PostTypeNullState = ({
  type,
}: {
  type: FeedItemSubjectTypeEnum;
}) => {
  const { t } = useTranslation('postTypes');
  return (
    <View style={styles.nullState}>
      <Text style={styles.nullStateText}>{t(`nullState.${type}`)}</Text>
      <Text style={[PostTypeColorStyle[type], styles.nullStateReferenceText]}>
        {t(`nullStateReference.${type}`).toUpperCase()}
      </Text>
    </View>
  );
};

export default PostTypeLabel;
