import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Text, Button } from '../../components/common';
import {
  INTERACTION_TYPES,
  CELEBRATEABLE_TYPES,
  GLOBAL_COMMUNITY_ID,
} from '../../constants';
import { navigatePush } from '../../actions/navigation';
import { reloadGroupChallengeFeed } from '../../actions/challenges';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import { getFirstNameAndLastInitial } from '../../utils/common';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { CommunityCelebrationCelebrateableEnum } from '../../../__generated__/globalTypes';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

export interface CelebrateItemContentProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  event: CelebrateItem;
  organization: Organization;
  style?: StyleProp<ViewStyle>;
}

const {
  challengeItemTypes: { accepted, completed },
} = CELEBRATEABLE_TYPES;
const {
  MHInteractionTypePersonalDecision,
  MHInteractionTypeSomethingCoolHappened,
  MHInteractionTypeSpiritualConversation,
  MHInteractionTypeGospelPresentation,
  MHInteractionTypeHolySpiritConversation,
  MHInteractionTypeDiscipleshipConversation,
} = INTERACTION_TYPES;

const CelebrateItemContent = ({
  dispatch,
  event,
  organization,
  style,
}: CelebrateItemContentProps) => {
  const { t } = useTranslation('celebrateFeeds');

  const { name: communityName = '' } = organization || {};
  const {
    adjectiveAttributeValue,
    changedAttributeName,
    subjectPerson,
    subjectPersonName,
    celebrateableType,
    objectDescription,
  } = event;

  const personName = subjectPerson
    ? `${getFirstNameAndLastInitial(
        subjectPerson.firstName,
        subjectPerson.lastName,
      )}.`
    : subjectPersonName
    ? subjectPersonName
    : t('aMissionHubUser');

  const onPressChallengeLink = async () => {
    const orgId = organization.id;
    const challengeId = adjectiveAttributeValue;
    if (orgId && orgId !== GLOBAL_COMMUNITY_ID) {
      await dispatch(reloadGroupChallengeFeed(orgId));
      dispatch(
        navigatePush(CHALLENGE_DETAIL_SCREEN, {
          challengeId,
          orgId,
        }),
      );
    }
  };

  const buildJoinedCommunityMessage = () => {
    return t('joinedCommunity', { initiator: personName, communityName });
  };

  const buildCreateCommunityMessage = () => {
    return t('communityCreated', { initiator: personName, communityName });
  };

  const buildChallengeMessage = () => {
    switch (changedAttributeName) {
      case accepted:
        return t('challengeAccepted', { initiator: personName });
      case completed:
        return t('challengeCompleted', { initiator: personName });
    }
  };

  const buildInteractionMessage = () => {
    switch (adjectiveAttributeValue) {
      case MHInteractionTypePersonalDecision.id:
        return t('interactionDecision', { initiator: personName });
      case MHInteractionTypeSomethingCoolHappened.id:
        return t('somethingCoolHappened', { initiator: personName });
      default:
        return t('interaction', {
          initiator: personName,
          interactionName: renderInteraction(),
        });
    }
  };

  const renderStepOfFaithMessage = () => {
    return t(
      adjectiveAttributeValue
        ? adjectiveAttributeValue === '6'
          ? 'stepOfFaithNotSureStage'
          : 'stepOfFaith'
        : 'stepOfFaithUnknownStage',
      {
        initiator: personName,
        receiverStage: renderStage(),
      },
    );
  };

  const renderStage = () => {
    switch (adjectiveAttributeValue) {
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

  const renderInteraction = () => {
    switch (adjectiveAttributeValue) {
      case MHInteractionTypeSpiritualConversation.id:
        return t('actions:interactionSpiritualConversation');
      case MHInteractionTypeGospelPresentation.id:
        return t('actions:interactionGospel');
      case MHInteractionTypeHolySpiritConversation.id:
        return t('actions:interactionSpirit');
      case MHInteractionTypeDiscipleshipConversation.id:
        return t('actions:interactionDiscipleshipConversation');
      default:
        return '';
    }
  };

  const renderMessage = () => {
    switch (celebrateableType) {
      case CommunityCelebrationCelebrateableEnum.COMPLETED_STEP:
        return renderStepOfFaithMessage();
      case CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION:
        return buildInteractionMessage();
      case CommunityCelebrationCelebrateableEnum.COMMUNITY_CHALLENGE:
        return buildChallengeMessage();
      case CommunityCelebrationCelebrateableEnum.CREATED_COMMUNITY:
        return buildCreateCommunityMessage();
      case CommunityCelebrationCelebrateableEnum.JOINED_COMMUNITY:
        return buildJoinedCommunityMessage();
      case CommunityCelebrationCelebrateableEnum.STORY:
        return objectDescription;
    }
  };

  const renderChallengeLink = () => {
    return celebrateableType ===
      CommunityCelebrationCelebrateableEnum.COMMUNITY_CHALLENGE ? (
      <View style={styles.row}>
        <Button
          testID="ChallengeLinkButton"
          type="transparent"
          onPress={onPressChallengeLink}
          style={styles.challengeLinkButton}
        >
          <Text numberOfLines={2} style={styles.challengeLinkText}>
            {objectDescription}
          </Text>
        </Button>
      </View>
    ) : null;
  };

  return (
    <View style={[styles.description, style]}>
      <Text style={styles.messageText}>{renderMessage()}</Text>
      {renderChallengeLink()}
    </View>
  );
};

export default connect()(CelebrateItemContent);
