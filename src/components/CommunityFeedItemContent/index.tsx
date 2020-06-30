import React from 'react';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Markdown from 'react-native-markdown-renderer';

import { Text, Button, Touchable } from '../common';
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
import { TouchablePress } from '../Touchable/index.ios';
import DefaultCommunityAvatar from '../../../assets/images/defaultCommunityAvatar.svg';
import PopupMenu from '../PopupMenu';
import KebabIcon from '../../../assets/images/kebabIcon.svg';
import theme from '../../theme';

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
  onCommentPress?: TouchablePress;
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

  const { subject, subjectPerson, subjectPersonName, community } = feedItem;
  const imageData =
    (subject.__typename === 'Post' && subject.mediaExpiringUrl) || null;
  const stepStatus =
    (subject.__typename === 'Post' && subject.stepStatus) ||
    PostStepStatusEnum.NOT_SUPPORTED;
  const imageAspectRatio = useAspectRatio(imageData);

  const itemType = getFeedItemType(subject);
  const addToSteps =
    [
      FeedItemSubjectTypeEnum.HELP_REQUEST,
      FeedItemSubjectTypeEnum.PRAYER_REQUEST,
      FeedItemSubjectTypeEnum.QUESTION,
    ].includes(itemType) && stepStatus === PostStepStatusEnum.NONE;

  const personName = subjectPerson
    ? `${getFirstNameAndLastInitial(
        subjectPerson.firstName,
        subjectPerson.lastName,
      )}.`
    : subjectPersonName
    ? subjectPersonName
    : t('aMissionHubUser');

  const isGlobal = !community;

  const onPressChallengeLink = async () => {
    const challengeId = subject.id;
    const communityId = community ? community.id : GLOBAL_COMMUNITY_ID;
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
      navigatePush(COMMUNITY_FEED_WITH_TYPE_SCREEN, {
        type: itemType,
        communityId: community?.id,
        communityName: community?.name,
      }),
    );
  };

  const handleAddToMySteps = () =>
    dispatch(
      navigatePush(ADD_POST_TO_STEPS_SCREEN, {
        feedItemId: feedItem.id,
        communityId: community?.id,
      }),
    );

  const renderChallengeMessage = (
    subject: CommunityFeedItemContent_subject_AcceptedCommunityChallenge,
  ) => {
    return t(subject.completedAt ? 'challengeCompleted' : 'challengeAccepted', {
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

  const renderMessage = () => {
    switch (subject.__typename) {
      case 'Step':
        return renderText(renderStepOfFaithMessage(subject));
      case 'AcceptedCommunityChallenge':
        return renderText(renderChallengeMessage(subject));
      case 'Post':
        return renderPostMessage(subject);
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
    <Text style={styles.messageText}>{text}</Text>
  );

  const renderPostMessage = (
    subject: CommunityFeedItemContent_subject_Post,
  ) => <Markdown style={markdown}>{subject.content}</Markdown>;

  const renderChallengeLink = (
    subject: CommunityFeedItemContent_subject_AcceptedCommunityChallenge,
  ) => (
    <View style={styles.row}>
      <Button
        testID="ChallengeLinkButton"
        type="transparent"
        onPress={onPressChallengeLink}
        style={styles.challengeLinkButton}
      >
        <Text numberOfLines={2} style={styles.challengeLinkText}>
          {subject.communityChallenge.title}
        </Text>
      </Button>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerWrap}>
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
              <KebabIcon color={theme.grey} />
            </PopupMenu>
          </View>
        ) : null}
      </View>
      <View style={styles.headerRow}>
        {!isGlobal ? renderAvatar() : null}
        <View
          style={
            isGlobal ? styles.globalHeaderNameWrapper : styles.headerNameWrapper
          }
        >
          {itemType === FeedItemSubjectTypeEnum.ANNOUNCEMENT ? (
            <Text style={styles.communityName}>{community?.name}</Text>
          ) : (
            <CommunityFeedItemName
              name={subjectPersonName}
              personId={subjectPerson?.id}
              communityId={community?.id}
              pressable={namePressable}
            />
          )}
          <CardTime date={feedItem.createdAt} style={styles.headerTime} />
        </View>
      </View>
    </View>
  );

  const renderImage = () =>
    imageData ? (
      <Image
        source={{ uri: imageData }}
        style={{ aspectRatio: imageAspectRatio }}
        resizeMode="cover"
      />
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
      <View style={styles.commentLikeWrap}>
        <CommentLikeComponent
          testID="CommentLikeComponent"
          feedItem={feedItem}
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

  return (
    <>
      {renderHeader()}
      <View style={styles.postTextWrap}>
        {renderMessage()}
        {subject.__typename === 'AcceptedCommunityChallenge'
          ? renderChallengeLink(subject)
          : null}
      </View>
      {renderImage()}
      {showLikeAndComment ? (
        <>
          <Separator />
          {renderFooter()}
        </>
      ) : null}
    </>
  );
};
