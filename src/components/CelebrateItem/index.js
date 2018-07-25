import React, { Component } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';

import {
  Card,
  Text,
  Flex,
  Button,
  DateComponent,
} from '../../components/common';
import { INTERACTION_TYPES, CELEBRATEABLE_TYPES } from '../../constants';
import GREY_HEART from '../../../assets/images/heart-grey.png';
import BLUE_HEART from '../../../assets/images/heart-blue.png';

import styles from './styles';

@translate('celebrateFeeds')
export default class CelebrateItem extends Component {
  onPressLikeIcon = () => {
    const { event, onToggleLike } = this.props;
    onToggleLike(event.id, event.liked);
  };

  renderMessage() {
    const { t, event } = this.props;
    const { completedInteraction, completedStep } = CELEBRATEABLE_TYPES;
    const { adjective_attribute_value } = event;

    const name = event.subject_person_name.split(' ')[0];

    switch (event.celebrateable_type) {
      case completedStep:
        return this.renderStepOfFaithMessage(t, event, name);
      case completedInteraction:
        return this.buildInteractionMessage(t, adjective_attribute_value, name);
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
      <Card style={styles.card}>
        <Flex value={1} direction={'row'}>
          <Flex value={1} direction={'column'}>
            <Text style={styles.name}>{subject_person_name.toUpperCase()}</Text>
            <DateComponent
              style={styles.time}
              date={changed_attribute_value}
              format={'LT'}
            />
            <Text style={styles.description}>{this.renderMessage()}</Text>
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
