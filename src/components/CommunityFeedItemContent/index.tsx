import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Markdown from 'react-native-markdown-renderer';

import { Text, Button } from '../common';
import { navigatePush } from '../../actions/navigation';
import { reloadGroupChallengeFeed } from '../../actions/challenges';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import {
  getFirstNameAndLastInitial,
  getFeedItemType,
} from '../../utils/common';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CombinedFeedItem } from '../CommunityFeedItem';
import {
  CommunityFeedStep,
  CommunityFeedStep_receiverStageAtCompletion,
} from '../CommunityFeedItem/__generated__/CommunityFeedStep';
import { CommunityFeedPost } from '../CommunityFeedItem/__generated__/CommunityFeedPost';
import { CommunityFeedChallenge } from '../CommunityFeedItem/__generated__/CommunityFeedChallenge';
import markdownStyles from '../../markdownStyles';

import styles from './styles';

export interface CommunityFeedItemContentProps {
  item: CombinedFeedItem;
  communityId: string;
  style?: StyleProp<ViewStyle>;
}

export const CommunityFeedItemContent = ({
  item,
  communityId,
  style,
}: CommunityFeedItemContentProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();

  const { subject, subjectPerson, subjectPersonName } = item;
  const itemType = getFeedItemType(subject);

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

  const renderMessage = () => {
    switch (subject.__typename) {
      case 'Step':
        return renderText(renderStepOfFaithMessage());
      case 'CommunityChallenge':
        return renderText(buildChallengeMessage());
      case 'Post':
        return renderPostMessage();
    }
  };

  const renderText = (text: string) => (
    <Text style={styles.messageText}>{text}</Text>
  );

  const renderPostMessage = () => (
    <Markdown style={markdownStyles}>
      {(subject as CommunityFeedPost).content}
    </Markdown>
  );

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

  return (
    <View style={style}>
      {renderMessage()}
      {itemType === FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE
        ? renderChallengeLink()
        : null}
    </View>
  );
};
