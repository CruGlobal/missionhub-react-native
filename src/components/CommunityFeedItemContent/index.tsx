/* eslint-disable max-lines */
import React from 'react';
import { View, Image, GestureResponderEvent, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Markdown from 'react-native-markdown-display';

import { Touchable } from '../common';
import { navigatePush } from '../../actions/navigation';
import { reloadGroupChallengeFeed } from '../../actions/challenges';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import {
  getFirstNameAndLastInitial,
  getFeedItemType,
} from '../../utils/common';
import {
  FeedItemSubjectTypeEnum,
  PostStepStatusEnum,
  FeedItemSubjectEventEnum,
} from '../../../__generated__/globalTypes';
import PostTypeLabel from '../PostTypeLabel';
import Avatar from '../Avatar';
import { CommunityFeedItemName } from '../CommunityFeedItemName';
import CardTime from '../CardTime';
import { CommentLikeComponent } from '../CommentLikeComponent';
import { ADD_POST_TO_STEPS_SCREEN } from '../../containers/AddPostToStepsScreen';
import Separator from '../Separator';
import { COMMUNITY_FEED_WITH_TYPE_SCREEN } from '../../containers/CommunityFeedWithType';
import { useAspectRatio } from '../../utils/hooks/useAspectRatio';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import DefaultCommunityAvatar from '../../../assets/images/defaultCommunityAvatar.svg';
import PopupMenu from '../PopupMenu';
import VideoPlayer from '../VideoPlayer';
import KebabIcon from '../../../assets/images/kebabIcon.svg';
import ChallengesTarget from '../../../assets/images/challenge-target.svg';
import theme from '../../theme';
import { useFeatureFlags } from '../../utils/hooks/useFeatureFlags';

import {
  CommunityFeedItemContent as FeedItem,
  CommunityFeedItemContent_subject_Post,
  CommunityFeedItemContent_subject_Step,
  CommunityFeedItemContent_subject_Step_receiverStageAtCompletion,
  CommunityFeedItemContent_subject_AcceptedCommunityChallenge,
} from './__generated__/CommunityFeedItemContent';
import StepIcon from './stepIcon.svg';
import PlusIcon from './plusIcon.svg';
import styles, { markdown } from './styles';

export interface CommunityFeedItemContentProps {
  feedItem: FeedItem;
  namePressable?: boolean;
  postLabelPressable?: boolean;
  showLikeAndComment?: boolean;
  onCommentPress?: (event: GestureResponderEvent) => void;
  menuActions?: { text: string; onPress: () => void; destructive?: boolean }[];
}

export const CommunityFeedItemContent = ({
  feedItem,
  namePressable = false,
  postLabelPressable = true,
  showLikeAndComment = true,
  onCommentPress,
  menuActions,
}: CommunityFeedItemContentProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();
  const { video: videoEnabled } = useFeatureFlags();

  const {
    subject,
    subjectEvent,
    subjectPerson,
    subjectPersonName,
    community,
  } = feedItem;
  if (
    subject.__typename !== 'Post' &&
    subject.__typename !== 'AcceptedCommunityChallenge' &&
    subject.__typename !== 'Step' &&
    subject.__typename !== 'CommunityPermission'
  ) {
    throw new Error(
      'Subject type of FeedItem must be Post, AcceptedCommunityChallenge, CommunityPermission or Step',
    );
  }

  const mediaData =
    (subject.__typename === 'Post' && subject.mediaExpiringUrl) || null;
  const mediaType =
    (subject.__typename === 'Post' && subject.mediaContentType) || null;
  const stepStatus =
    (subject.__typename === 'Post' && subject.stepStatus) ||
    PostStepStatusEnum.NOT_SUPPORTED;
  const aspectRatio = useAspectRatio(mediaData);

  const isGlobal = !community;
  const communityId = community?.id;
  const communityName = community?.name;

  const itemType = getFeedItemType(subject);
  const addToSteps =
    [
      FeedItemSubjectTypeEnum.HELP_REQUEST,
      FeedItemSubjectTypeEnum.PRAYER_REQUEST,
      FeedItemSubjectTypeEnum.QUESTION,
    ].includes(itemType) &&
    stepStatus === PostStepStatusEnum.NONE &&
    !isGlobal;

  const personName = subjectPerson
    ? `${getFirstNameAndLastInitial(
        subjectPerson.firstName,
        subjectPerson.lastName,
      )}.`
    : subjectPersonName
    ? subjectPersonName
    : t('aMissionHubUser');

  const onPressChallengeLink = async () => {
    const challengeId = (subject as CommunityFeedItemContent_subject_AcceptedCommunityChallenge)
      .communityChallenge.id;
    const communityId = community ? community.id : GLOBAL_COMMUNITY_ID;
    await dispatch(reloadGroupChallengeFeed(communityId));
    dispatch(
      navigatePush(CHALLENGE_DETAIL_SCREEN, {
        communityName,
        challengeId,
        orgId: communityId,
      }),
    );
  };

  const navToFilteredFeed = () => {
    dispatch(
      navigatePush(COMMUNITY_FEED_WITH_TYPE_SCREEN, {
        type: itemType,
        communityId,
        communityName,
      }),
    );
  };

  const handleAddToMySteps = () =>
    dispatch(
      navigatePush(ADD_POST_TO_STEPS_SCREEN, {
        feedItemId: feedItem.id,
        communityId,
      }),
    );

  const renderChallengeMessage = (
    subject: CommunityFeedItemContent_subject_AcceptedCommunityChallenge,
  ) => {
    return subject.communityChallenge.title || '';
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

  const renderNewMemberMessage = () =>
    t('newMemberMessage', {
      personFirstName: subjectPerson?.firstName,
    });

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

  const renderMessage = () => {
    switch (subject.__typename) {
      case 'Step':
        return renderText(renderStepOfFaithMessage(subject));
      case 'AcceptedCommunityChallenge':
        return renderText(renderChallengeMessage(subject));
      case 'Post':
        return renderPostMessage(subject);
      case 'CommunityPermission':
        return renderText(renderNewMemberMessage());
    }
  };

  const renderAvatar = () => {
    switch (itemType) {
      case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
        return community?.communityPhotoUrl ? (
          <Image
            source={{ uri: community?.communityPhotoUrl }}
            style={styles.communityPhotoWrapStyles}
            resizeMode="cover"
          />
        ) : (
          <DefaultCommunityAvatar />
        );
      default:
        return subjectPerson ? (
          <Avatar size={'medium'} person={subjectPerson} />
        ) : null;
    }
  };

  const renderText = (text: string) => (
    <View style={styles.messageWrap}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );

  const renderPostMessage = (
    subject: CommunityFeedItemContent_subject_Post,
  ) => <Markdown style={markdown}>{subject.content}</Markdown>;

  const renderHeader = () => (
    <View style={styles.headerWrap}>
      {subject.__typename === 'AcceptedCommunityChallenge' ||
      subject.__typename === 'CommunityPermission' ? null : (
        <View style={styles.headerRow}>
          <PostTypeLabel
            type={itemType}
            onPress={postLabelPressable ? navToFilteredFeed : undefined}
          />
          {menuActions && menuActions.length > 0 ? (
            <View style={styles.popupMenuWrap}>
              <PopupMenu
                actions={menuActions}
                buttonProps={{ style: styles.popupButton }}
              >
                <KebabIcon color={theme.lightGrey} />
              </PopupMenu>
            </View>
          ) : null}
        </View>
      )}
      <View style={styles.headerRow}>
        {!isGlobal ? renderAvatar() : null}
        <View
          style={[
            styles.headerNameWrapper,
            isGlobal ? styles.globalHeaderNameWrapper : undefined,
          ]}
        >
          {itemType === FeedItemSubjectTypeEnum.ANNOUNCEMENT ? (
            <Text style={styles.communityName}>
              {community?.name || subjectPersonName}
            </Text>
          ) : (
            <CommunityFeedItemName
              name={subjectPersonName}
              personId={subjectPerson?.id}
              communityId={communityId}
              pressable={namePressable}
            />
          )}
          <CardTime date={feedItem.createdAt} style={styles.headerTime} />
        </View>
      </View>
    </View>
  );

  const renderMedia = () =>
    mediaData && mediaType?.includes('image') ? (
      <Image
        source={{ uri: mediaData }}
        style={{ aspectRatio }}
        resizeMode="cover"
      />
    ) : mediaData && videoEnabled && mediaType?.includes('video') ? (
      <Touchable
        isAndroidOpacity={true}
        activeOpacity={1}
        onPress={() => {}}
        testID="VideoTouchable"
      >
        <VideoPlayer uri={mediaData} />
      </Touchable>
    ) : null;

  const renderFooter = () => (
    <Touchable
      isAndroidOpacity={true}
      activeOpacity={1}
      onPress={() => {}}
      style={styles.footerWrap}
      testID="FooterTouchable"
    >
      {addToSteps ? renderAddToStepsButton() : null}
      {subject.__typename === 'AcceptedCommunityChallenge'
        ? renderViewChallengeButton()
        : null}
      <View style={styles.commentLikeWrap}>
        <CommentLikeComponent
          testID="CommentLikeComponent"
          feedItem={feedItem}
          hideComment={isGlobal}
          onCommentPress={onCommentPress}
        />
      </View>
    </Touchable>
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
  const renderViewChallengeButton = () => (
    <Touchable
      onPress={onPressChallengeLink}
      style={styles.challengeLinkButton}
      testID="ChallengeLinkButton"
    >
      <ChallengesTarget style={styles.challengeIcon} color={theme.darkGrey} />
      <Text style={styles.addStepText}>{t('viewChallenge')}</Text>
    </Touchable>
  );

  return (
    <>
      {renderHeader()}
      <View style={styles.postTextWrap}>
        {subject.__typename === 'AcceptedCommunityChallenge' &&
        (subjectEvent === FeedItemSubjectEventEnum.challengeCompleted ||
          subjectEvent === FeedItemSubjectEventEnum.challengeJoined) ? (
          <Text style={styles.headerTextOnly}>
            {subjectEvent === FeedItemSubjectEventEnum.challengeCompleted
              ? t('challengeCompletedHeader')
              : t('challengeAcceptedHeader')}
          </Text>
        ) : null}
        {subject.__typename === 'CommunityPermission' ? (
          <Text style={styles.headerTextOnly}>{t('newMemberHeader')}</Text>
        ) : null}
        {renderMessage()}
      </View>
      {renderMedia()}
      {showLikeAndComment ? (
        <>
          <Separator />
          {renderFooter()}
        </>
      ) : null}
    </>
  );
};
