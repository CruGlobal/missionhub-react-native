import React, { useEffect, useState } from 'react';
import { View, StyleProp, ViewStyle, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Text, Button, Touchable } from '../common';
import { navigatePush } from '../../actions/navigation';
import { reloadGroupChallengeFeed } from '../../actions/challenges';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import {
  getFirstNameAndLastInitial,
  getFeedItemType,
} from '../../utils/common';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import {
  CommunityFeedItem,
  CommunityFeedItem_subject,
} from '../CommunityFeedItem/__generated__/CommunityFeedItem';
import {
  CommunityFeedStep,
  CommunityFeedStep_receiverStageAtCompletion,
} from '../CommunityFeedItem/__generated__/CommunityFeedStep';
import { CommunityFeedPost } from '../CommunityFeedItem/__generated__/CommunityFeedPost';
import { CommunityFeedChallenge } from '../CommunityFeedItem/__generated__/CommunityFeedChallenge';
import PostTypeLabel from '../PostTypeLabel';
import Avatar from '../Avatar';
import { CommunityFeedItemName } from '../CommunityFeedItemName';
import CardTime from '../CardTime';
import { CommentLikeComponent } from '../CommentLikeComponent';
import { ADD_POST_TO_STEPS_SCREEN } from '../../containers/AddPostToStepsScreen';
import Separator from '../Separator';

import PlusIcon from './plusIcon.svg';
import StepIcon from './stepIcon.svg';
import styles from './styles';
import { CELEBRATE_FEED_WITH_TYPE_SCREEN } from '../../containers/CelebrateFeedWithType';

export interface CommunityFeedItemContentProps {
  item: CombinedFeedItem;
  communityId: string;
  namePressable?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const CommunityFeedItemContent = ({
  item,
  communityId,
  namePressable = false,
  onRefresh,
  style,
}: CommunityFeedItemContentProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();

  const [imageAspectRatio, changeImageAspectRatio] = useState(2);

  // TODO: share this function?
  const isPost = (
    subject: CommunityFeedItem_subject,
  ): subject is CommunityFeedPost => subject.__typename === 'Post';

  const imageData =
    (isPost(item.subject) && item.subject.mediaExpiringUrl) || null;

  useEffect(() => {
    if (!imageData) {
      return;
    }

    Image.getSize(
      imageData,
      (width, height) => changeImageAspectRatio(width / height),
      () => {},
    );
  }, [imageData]);

  const { subject, subjectPerson, subjectPersonName } = item;
  const itemType = getFeedItemType(subject);
  const addToSteps = [
    FeedItemSubjectTypeEnum.HELP_REQUEST,
    FeedItemSubjectTypeEnum.PRAYER_REQUEST,
    FeedItemSubjectTypeEnum.QUESTION,
  ].includes(itemType);

  const personName = subjectPerson
    ? `${getFirstNameAndLastInitial(
        subjectPerson.firstName,
        subjectPerson.lastName,
      )}.`
    : subjectPersonName
    ? subjectPersonName
    : t('aMissionHubUser');

  const onPressChallengeLink = async () => {
    const challengeId = subject.id;
    if (communityId) {
      await dispatch(reloadGroupChallengeFeed(communityId));
      dispatch(
        navigatePush(CHALLENGE_DETAIL_SCREEN, {
          challengeId,
          orgId: communityId,
        }),
      );
    }
  };

  const navToFilteredFeed = () => {
    dispatch(
      navigatePush(CELEBRATE_FEED_WITH_TYPE_SCREEN, {
        type: FeedItemType,
        communityId,
      }),
    );
  };

  const handleAddToMySteps = () =>
    dispatch(
      navigatePush(ADD_POST_TO_STEPS_SCREEN, {
        item,
        communityId,
      }),
    );

  const buildChallengeMessage = () => {
    const isCompleted = (subject as CommunityFeedChallenge).acceptedCommunityChallengesList.some(
      acceptedChallege => !!acceptedChallege.completedAt,
    );

    return t(isCompleted ? 'challengeCompleted' : 'challengeAccepted', {
      initiator: personName,
    });
  };

  const renderStepOfFaithMessage = () => {
    const { receiverStageAtCompletion } = subject as CommunityFeedStep;

    return t(
      receiverStageAtCompletion
        ? receiverStageAtCompletion.id === '6'
          ? 'stepOfFaithNotSureStage'
          : 'stepOfFaith'
        : 'stepOfFaithUnknownStage',
      {
        initiator: personName,
        receiverStage: renderStage(receiverStageAtCompletion),
      },
    );
  };

  const renderStage = (
    stage: CommunityFeedStep_receiverStageAtCompletion | null,
  ) => {
    switch (stage?.id || '') {
      case '1':
        return t('stages.uninterested.label');
      case '2':
        return t('stages.curious.label');
      case '3':
        return t('stages.forgiven.label');
      case '4':
        return t('stages.growing.label');
      case '5':
        return t('stages.guiding.label');
      default:
        return '';
    }
  };

  const renderPostMessage = () => (subject as CommunityFeedPost).content;

  const renderMessage = () => {
    switch (itemType) {
      case FeedItemSubjectTypeEnum.STEP:
        return renderStepOfFaithMessage();
      case FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE:
        return buildChallengeMessage();
      case FeedItemSubjectTypeEnum.STORY:
      case FeedItemSubjectTypeEnum.QUESTION:
      case FeedItemSubjectTypeEnum.PRAYER_REQUEST:
      case FeedItemSubjectTypeEnum.HELP_REQUEST:
      case FeedItemSubjectTypeEnum.THOUGHT:
      case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
        return renderPostMessage();
    }
  };

  const renderChallengeLink = () => (
    <View style={styles.row}>
      <Button
        testID="ChallengeLinkButton"
        type="transparent"
        onPress={onPressChallengeLink}
        style={styles.challengeLinkButton}
      >
        <Text numberOfLines={2} style={styles.challengeLinkText}>
          {(subject as CommunityFeedChallenge).title}
        </Text>
      </Button>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerWrap}>
      <View style={styles.headerRow}>
        <PostTypeLabel type={itemType} onPress={navToFilteredFeed} />
      </View>
      <View style={styles.headerRow}>
        {item.subjectPerson ? (
          <Avatar
            size={'medium'}
            person={item.subjectPerson}
            orgId={communityId}
          />
        ) : null}
        <View style={styles.headerNameWrapper}>
          <CommunityFeedItemName
            name={subjectPersonName}
            person={item.subjectPerson}
            communityId={communityId}
            pressable={namePressable}
          />
          <CardTime date={item.createdAt} style={styles.headerTime} />
        </View>
      </View>
    </View>
  );

  const renderImage = () =>
    imageData ? (
      <Image
        source={{ uri: imageData }}
        style={{
          aspectRatio: imageAspectRatio,
        }}
        resizeMode="contain"
      />
    ) : null;

  const renderFooter = () => (
    <View style={styles.footerWrap}>
      {addToSteps ? renderAddToStepsButton() : null}
      <View style={styles.commentLikeWrap}>
        <CommentLikeComponent
          item={item}
          communityId={communityId}
          onRefresh={onRefresh}
        />
      </View>
    </View>
  );

  const renderAddToStepsButton = () => (
    <Touchable
      style={styles.addStepWrap}
      onPress={handleAddToMySteps}
      testID="AddToMyStepsButton"
    >
      <StepIcon style={styles.stepIcon} />
      <PlusIcon style={styles.plusIcon} />
      <Text style={styles.addStepText}>{t('addToMySteps')}</Text>
    </Touchable>
  );

  return (
    <>
      {renderHeader()}
      <View style={style}>
        <Text style={styles.messageText}>{renderMessage()}</Text>
        {itemType === FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE
          ? renderChallengeLink()
          : null}
      </View>
      {renderImage()}
      <Separator />
      {renderFooter()}
    </>
  );
};
