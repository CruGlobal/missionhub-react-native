import React, { Component } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Card,
  Text,
  Flex,
  Button,
  DateComponent,
} from '../../components/common';
import {
  INTERACTION_TYPES,
  CELEBRATEABLE_TYPES,
  ACTIONS,
} from '../../constants';
import { navigatePush } from '../../actions/navigation';
import { CHALLENGE_DETAIL_SCREEN } from '../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../actions/analytics';
import GREY_HEART from '../../../assets/images/heart-grey.png';
import BLUE_HEART from '../../../assets/images/heart-blue.png';
import { getFirstNameAndLastInitial } from '../../utils/common';

import styles from './styles';

@translate('celebrateFeeds')
class CelebrateItem extends Component {
  onPressLikeIcon = () => {
    const { event, onToggleLike, dispatch } = this.props;
    onToggleLike(event.id, event.liked);
    !event.liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
  };

  onPressChallengeLink = () => {
    const { dispatch, event } = this.props;
    const {
      adjective_attribute_value: challengeId,
      organization: { id: orgId },
    } = event;

    dispatch(
      navigatePush(CHALLENGE_DETAIL_SCREEN, {
        challengeId,
        orgId,
      }),
    );
  };

  renderMessage() {
    const { t, event } = this.props;
    const {
      completedInteraction,
      completedStep,
      acceptedCommunityChallenge,
      createdCommunity,
    } = CELEBRATEABLE_TYPES;
    const {
      adjective_attribute_value,
      changed_attribute_name,
      subject_person: { first_name, last_name },
    } = event;

    const name = `${getFirstNameAndLastInitial(first_name, last_name)}.`;

    switch (event.celebrateable_type) {
      case completedStep:
        return this.renderStepOfFaithMessage(t, event, name);
      case completedInteraction:
        return this.buildInteractionMessage(t, adjective_attribute_value, name);
      case acceptedCommunityChallenge:
        return this.buildChallengeMessage(t, changed_attribute_name, name);
      case createdCommunity:
        return this.buildCreateCommunityMessage(t, event, name);
    }
  }

  buildCreateCommunityMessage(t, event, name) {
    const {
      organization: { name: communityName },
    } = event;
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

    if (adjective_attribute_value) {
      return t('stepOfFaith', {
        initiator: name,
        receiverStage: this.renderStage(t, adjective_attribute_value),
      });
    } else {
      return t('stepOfFaithUnknownStage', {
        initiator: name,
      });
    }
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
          text={object_description}
          onPress={this.onPressChallengeLink}
          style={styles.challengeLinkButton}
          buttonTextStyle={styles.challengeLinkText}
        />
      </Flex>
    ) : null;
  }

  render() {
    const { myId, event } = this.props;
    const {
      changed_attribute_value,
      subject_person_name,
      subject_person,
      likes_count,
      liked,
    } = event;
    const displayLikeCount = likes_count > 0 && subject_person.id === myId;

    return (
      <Card>
        <Flex value={1} direction={'row'} style={styles.content}>
          <Flex value={1} direction={'column'}>
            <Text style={styles.name}>{subject_person_name.toUpperCase()}</Text>
            <DateComponent
              style={styles.time}
              date={changed_attribute_value}
              format={'LT'}
            />
            <Text style={styles.description}>{this.renderMessage()}</Text>
            {this.renderChallengeLink()}
          </Flex>
          <Flex direction={'column'} align="start">
            <Flex direction={'row'} align="center">
              <Text style={styles.likeCount}>
                {displayLikeCount ? likes_count : null}
              </Text>
              <Button
                name="likeActiveIcon"
                onPress={this.onPressLikeIcon}
                style={[styles.icon]}
              >
                <Image source={liked ? BLUE_HEART : GREY_HEART} />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }
}

CelebrateItem.propTypes = {
  event: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
  onToggleLike: PropTypes.func.isRequired,
};

export default connect()(CelebrateItem);
