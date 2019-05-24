import React, { Component } from 'react';
import { View } from 'react-native';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Text, Flex, Button, Separator } from '../../components/common';
import {
  INTERACTION_TYPES,
  CELEBRATEABLE_TYPES,
  GLOBAL_COMMUNITY_ID,
} from '../../constants';
import { navigatePush } from '../../actions/navigation';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import { getFirstNameAndLastInitial } from '../../utils/common';
import CardTime from '../CardTime';
import CommentLikeComponent from '../../containers/CommentLikeComponent';
import CelebrateItemName from '../../containers/CelebrateItemName';

import styles from './styles';

@withTranslation('celebrateFeeds')
class CelebrateItem extends Component {
  onPressItem = () => {
    const { onPressItem, event } = this.props;
    onPressItem && onPressItem(event);
  };

  onPressChallengeLink = () => {
    const { dispatch, event } = this.props;
    const { adjective_attribute_value: challengeId, organization } = event;
    const orgId = organization && organization.id;

    if (orgId && orgId !== GLOBAL_COMMUNITY_ID) {
      dispatch(
        navigatePush(CHALLENGE_DETAIL_SCREEN, {
          challengeId,
          orgId,
        }),
      );
    }
  };

  renderMessage() {
    const { t, event } = this.props;
    const {
      completedInteraction,
      completedStep,
      acceptedCommunityChallenge,
      createdCommunity,
      joinedCommunity,
    } = CELEBRATEABLE_TYPES;
    const {
      adjective_attribute_value,
      changed_attribute_name,
      subject_person,
    } = event;

    const name = subject_person
      ? `${getFirstNameAndLastInitial(
          subject_person.first_name,
          subject_person.last_name,
        )}.`
      : event.subject_person_name
      ? event.subject_person_name
      : t('aMissionHubUser');

    switch (event.celebrateable_type) {
      case completedStep:
        return this.renderStepOfFaithMessage(t, event, name);
      case completedInteraction:
        return this.buildInteractionMessage(t, adjective_attribute_value, name);
      case acceptedCommunityChallenge:
        return this.buildChallengeMessage(t, changed_attribute_name, name);
      case createdCommunity:
        return this.buildCreateCommunityMessage(t, event, name);
      case joinedCommunity:
        return this.buildJoinedCommunityMessage(t, event, name);
    }
  }

  buildJoinedCommunityMessage(t, event, name) {
    const organization = this.props.organization || event.organization;
    const { name: communityName } = organization;

    return t('joinedCommunity', { initiator: name, communityName });
  }

  buildCreateCommunityMessage(t, event, name) {
    const organization = this.props.organization || event.organization;
    const { name: communityName } = organization;

    return t('communityCreated', { initiator: name, communityName });
  }

  buildChallengeMessage(t, type, name) {
    const {
      challengeItemTypes: { accepted, completed },
    } = CELEBRATEABLE_TYPES;

    switch (type) {
      case accepted:
        return t('challengeAccepted', { initiator: name });
      case completed:
        return t('challengeCompleted', { initiator: name });
    }
  }

  buildInteractionMessage(t, type, name) {
    const {
      MHInteractionTypePersonalDecision,
      MHInteractionTypeSomethingCoolHappened,
    } = INTERACTION_TYPES;
    const { completedInteraction } = CELEBRATEABLE_TYPES;

    switch (parseInt(type)) {
      case MHInteractionTypePersonalDecision.id:
        return t('interactionDecision', { initiator: name });
      case MHInteractionTypeSomethingCoolHappened.id:
        return t('somethingCoolHappened', { initiator: name });
      default:
        return t(completedInteraction, {
          initiator: name,
          interactionName: this.renderInteraction(),
        });
    }
  }
  renderStepOfFaithMessage(t, event, name) {
    const { adjective_attribute_value } = event;

    return t(
      adjective_attribute_value
        ? adjective_attribute_value === '6'
          ? 'stepOfFaithNotSureStage'
          : 'stepOfFaith'
        : 'stepOfFaithUnknownStage',
      {
        initiator: name,
        receiverStage: this.renderStage(t, adjective_attribute_value),
      },
    );
  }

  renderStage(t, stage) {
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
  }

  renderInteraction() {
    const { t, event } = this.props;
    const { adjective_attribute_value } = event;
    const {
      MHInteractionTypeSpiritualConversation,
      MHInteractionTypeGospelPresentation,
      MHInteractionTypeHolySpiritConversation,
      MHInteractionTypeDiscipleshipConversation,
    } = INTERACTION_TYPES;

    switch (parseInt(adjective_attribute_value)) {
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
  }

  renderChallengeLink() {
    const { event } = this.props;
    const { acceptedCommunityChallenge } = CELEBRATEABLE_TYPES;
    const { celebrateable_type, object_description } = event;

    return celebrateable_type === acceptedCommunityChallenge ? (
      <Flex direction="row">
        <Button
          type="transparent"
          onPress={this.onPressChallengeLink}
          style={styles.challengeLinkButton}
        >
          <Text numberOfLines={2} style={styles.challengeLinkText}>
            {object_description}
          </Text>
        </Button>
      </Flex>
    ) : null;
  }

  render() {
    const {
      event,
      onPressItem,
      cardStyle,
      rightCorner,
      namePressable,
      fixedHeight,
    } = this.props;
    const {
      changed_attribute_value,
      subject_person,
      subject_person_name,
    } = event;
    const organization = this.props.organization || event.organization;
    const {
      content,
      top,
      topLeft,
      description,
      fixedHeightDescription,
      messageText,
    } = styles;

    return (
      <Card onPress={onPressItem && this.onPressItem} style={cardStyle}>
        <Flex value={1} direction="column">
          <Flex direction="column" style={content}>
            <View style={top}>
              <View style={topLeft}>
                <CelebrateItemName
                  name={subject_person_name}
                  person={subject_person}
                  organization={organization}
                  pressable={namePressable}
                />
                <CardTime date={changed_attribute_value} />
              </View>
              {rightCorner}
            </View>
            <View
              style={[description, fixedHeight ? fixedHeightDescription : {}]}
            >
              <Text style={messageText}>{this.renderMessage()}</Text>
              {this.renderChallengeLink()}
            </View>
          </Flex>
          <Separator />
          <CommentLikeComponent event={event} style={content} />
        </Flex>
      </Card>
    );
  }
}

CelebrateItem.propTypes = {
  event: PropTypes.object.isRequired,
  organization: PropTypes.object,
  namePressable: PropTypes.bool,
  fixedHeight: PropTypes.bool,
};

export default connect()(CelebrateItem);
