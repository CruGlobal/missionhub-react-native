import React from 'react';
import { View, Image } from 'react-native';
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
import PostTypeLabel from '../PostTypeLabel';
import Avatar from '../Avatar';
import { CommunityFeedItemName } from '../CommunityFeedItemName';
import CardTime from '../CardTime';
import { CommentLikeComponent } from '../CommentLikeComponent';
import { ADD_POST_TO_STEPS_SCREEN } from '../../containers/AddPostToStepsScreen';
import Separator from '../Separator';
import { CELEBRATE_FEED_WITH_TYPE_SCREEN } from '../../containers/CelebrateFeedWithType';
import { useAspectRatio } from '../../utils/hooks/useAspectRatio';
import { GLOBAL_COMMUNITY_ID } from '../../constants';

import PlusIcon from './plusIcon.svg';
import StepIcon from './stepIcon.svg';
import styles from './styles';
import {
  CommunityFeedItemContent as FeedItem,
  CommunityFeedItemContent_subject_Post,
  CommunityFeedItemContent_subject_Step,
  CommunityFeedItemContent_subject_Step_receiverStageAtCompletion,
  CommunityFeedItemContent_subject_CommunityChallenge,
} from './__generated__/CommunityFeedItemContent';

export interface CommunityFeedItemContentProps {
  feedItem: FeedItem;
  namePressable?: boolean;
}

export const CommunityFeedItemContent = ({
  feedItem,
  namePressable = false,
}: CommunityFeedItemContentProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();

  const imageData =
    (feedItem.subject.__typename === 'Post' &&
      feedItem.subject.mediaExpiringUrl) ||
    null;

  const imageAspectRatio = useAspectRatio(imageData);

  const { subject, subjectPerson, subjectPersonName } = feedItem;
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
    const communityId = feedItem.community
      ? feedItem.community.id
      : GLOBAL_COMMUNITY_ID;
    await dispatch(reloadGroupChallengeFeed(communityId));
    dispatch(
      navigatePush(CHALLENGE_DETAIL_SCREEN, {
        challengeId,
        orgId: communityId,
      }),
    );
  };

  const navToFilteredFeed = () => {
    dispatch(
      navigatePush(CELEBRATE_FEED_WITH_TYPE_SCREEN, {
        type: itemType,
        communityId: feedItem.community?.id,
      }),
    );
  };

  const handleAddToMySteps = () =>
    dispatch(
      navigatePush(ADD_POST_TO_STEPS_SCREEN, {
        feedItemId: feedItem.id,
        communityId: feedItem.community?.id,
      }),
    );

  const buildChallengeMessage = (
    subject: CommunityFeedItemContent_subject_CommunityChallenge,
  ) => {
    const isCompleted = subject.acceptedCommunityChallengesList.some(
      acceptedChallege => !!acceptedChallege.completedAt,
    );

    return t(isCompleted ? 'challengeCompleted' : 'challengeAccepted', {
      initiator: personName,
    });
  };

  const renderStepOfFaithMessage = (
    subject: CommunityFeedItemContent_subject_Step,
  ) => {
    const { receiverStageAtCompletion } = subject;

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
    stage: CommunityFeedItemContent_subject_Step_receiverStageAtCompletion | null,
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

  const renderPostMessage = (subject: CommunityFeedItemContent_subject_Post) =>
    subject.content;

  const renderMessage = () => {
    switch (subject.__typename) {
      case 'Step':
        return renderStepOfFaithMessage(subject);
      case 'CommunityChallenge':
        return buildChallengeMessage(subject);
      case 'Post':
        return renderPostMessage(subject);
    }
  };

  const renderChallengeLink = (
    subject: CommunityFeedItemContent_subject_CommunityChallenge,
  ) => (
    <View style={styles.row}>
      <Button
        testID="ChallengeLinkButton"
        type="transparent"
        onPress={onPressChallengeLink}
        style={styles.challengeLinkButton}
      >
        <Text numberOfLines={2} style={styles.challengeLinkText}>
          {subject.title}
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
        {feedItem.subjectPerson ? (
          <Avatar size={'medium'} person={feedItem.subjectPerson} />
        ) : null}
        <View style={styles.headerNameWrapper}>
          <CommunityFeedItemName
            name={subjectPersonName}
            personId={feedItem.subjectPerson?.id}
            pressable={namePressable}
          />
          <CardTime date={feedItem.createdAt} style={styles.headerTime} />
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
        resizeMode="cover"
      />
    ) : null;

  const renderFooter = () => (
    <View style={styles.footerWrap}>
      {addToSteps ? renderAddToStepsButton() : null}
      <View style={styles.commentLikeWrap}>
        <CommentLikeComponent feedItem={feedItem} />
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
      <View style={styles.postTextWrap}>
        <Text style={styles.messageText}>{renderMessage()}</Text>
        {subject.__typename === 'CommunityChallenge'
          ? renderChallengeLink(subject)
          : null}
      </View>
      {renderImage()}
      <Separator />
      {renderFooter()}
    </>
  );
};
