import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { Text, Button } from '../../components/common';
import {
  INTERACTION_TYPES,
  CELEBRATEABLE_TYPES,
  GLOBAL_COMMUNITY_ID,
} from '../../constants';
import { navigatePush } from '../../actions/navigation';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import { getFirstNameAndLastInitial } from '../../utils/common';

import styles from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

export interface CelebrateItemContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  event: Event;
  organization?: object;
  fixedHeight?: boolean;
  style?: StyleProp<ViewStyle>;
}

const {
  challengeItemTypes: { accepted, completed },
  completedInteraction,
  completedStep,
  acceptedCommunityChallenge,
  createdCommunity,
  joinedCommunity,
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
  fixedHeight,
  style,
}: CelebrateItemContentProps) => {
  const { t } = useTranslation('celebrateFeeds');

  const org = organization || event.organization || {};
  const { name: communityName = '' } = org || {};
  const {
    adjective_attribute_value,
    changed_attribute_name,
    subject_person,
    subject_person_name,
    celebrateable_type,
    object_description,
  } = event;

  const onPressChallengeLink = () => {
    const orgId = org.id;
    const challengeId = adjective_attribute_value;
    if (orgId && orgId !== GLOBAL_COMMUNITY_ID) {
      dispatch(
        navigatePush(CHALLENGE_DETAIL_SCREEN, {
          challengeId,
          orgId,
        }),
      );
    }
  };

  const buildJoinedCommunityMessage = (name: string) => {
    return t('joinedCommunity', { initiator: name, communityName });
  };

  const buildCreateCommunityMessage = (name: string) => {
    return t('communityCreated', { initiator: name, communityName });
  };

  const buildChallengeMessage = (type: string, name: string) => {
    switch (type) {
      case accepted:
        return t('challengeAccepted', { initiator: name });
      case completed:
        return t('challengeCompleted', { initiator: name });
    }
  };

  const buildInteractionMessage = (type: string, name: string) => {
    switch (`${type}`) {
      case MHInteractionTypePersonalDecision.id:
        return t('interactionDecision', { initiator: name });
      case MHInteractionTypeSomethingCoolHappened.id:
        return t('somethingCoolHappened', { initiator: name });
      default:
        return t(completedInteraction, {
          initiator: name,
          interactionName: renderInteraction(),
        });
    }
  };

  const renderStepOfFaithMessage = (name: string) => {
    return t(
      adjective_attribute_value
        ? adjective_attribute_value === '6'
          ? 'stepOfFaithNotSureStage'
          : 'stepOfFaith'
        : 'stepOfFaithUnknownStage',
      {
        initiator: name,
        receiverStage: renderStage(adjective_attribute_value),
      },
    );
  };

  const renderStage = (stage: string) => {
    switch (stage) {
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
    switch (`${adjective_attribute_value}`) {
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
    const name = subject_person
      ? `${getFirstNameAndLastInitial(
          subject_person.first_name,
          subject_person.last_name,
        )}.`
      : subject_person_name
      ? subject_person_name
      : t('aMissionHubUser');
    switch (celebrateable_type) {
      case completedStep:
        return renderStepOfFaithMessage(name);
      case completedInteraction:
        return buildInteractionMessage(adjective_attribute_value, name);
      case acceptedCommunityChallenge:
        return buildChallengeMessage(changed_attribute_name, name);
      case createdCommunity:
        return buildCreateCommunityMessage(name);
      case joinedCommunity:
        return buildJoinedCommunityMessage(name);
    }
  };

  const renderChallengeLink = () => {
    return celebrateable_type === acceptedCommunityChallenge ? (
      <View style={styles.row}>
        <Button
          testID="ChallengeLinkButton"
          type="transparent"
          onPress={onPressChallengeLink}
          style={styles.challengeLinkButton}
        >
          <Text numberOfLines={2} style={styles.challengeLinkText}>
            {object_description}
          </Text>
        </Button>
      </View>
    ) : null;
  };

  return (
    <View
      style={[
        styles.description,
        fixedHeight ? styles.fixedHeightDescription : {},
        style,
      ]}
    >
      <Text style={styles.messageText}>{renderMessage()}</Text>
      {renderChallengeLink()}
    </View>
  );
};
export default connect()(CelebrateItemContent);
