import React, { Component } from 'react';
import { translate } from 'react-i18next';

import {
  Card,
  Text,
  Flex,
  IconButton,
  DateComponent,
} from '../../components/common';

import styles from './styles';

@translate('celebrateFeeds')
export default class Celebrate extends Component {
  onPressLikeIcon = () => {};

  renderMessage() {
    const { t, event, person, me } = this.props;

    switch (event.celebrateable_type) {
      case 'V4::ContactAssignment': //TODO: this should be V4::Person ?
        return t('addedContact', {
          initiator: person.first_name,
          receiverStage: this.renderStage(),
        });
      case 'V4::AcceptedChallenge':
        return t('stepOfFaith', {
          initiator: person.first_name,
          receiverStage: this.renderStage(),
        });
      case 'V4::Interaction':
        return t('interaction', {
          initiator: person.first_name,
          interactionName: this.renderInteraction(),
        });
    }
  }

  renderName() {}

  renderStage() {
    const { t, event } = this.props;
    const { adjective_attribute_value } = event;

    switch (adjective_attribute_value) {
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
        return 'unknown';
    }
  }

  renderInteraction() {
    const { t, event } = this.props;
    const { adjective_attribute_value } = event;

    switch (adjective_attribute_value) {
      case '2':
        return t('actions:interactionSpiritualConversation');
      case '3':
        return t('actions:interactionGospel');
      case '4':
        return t('actions:interactionDiscipleshipConversation');
      case '5':
        return t('actions:interactionSpirit');
      case '9':
        return t('actions:interactionDiscipleshipConversation');
      default:
        return '';
    }
  }

  render() {
    const { changed_attribute_value, likes_count } = this.props.event;
    const { full_name } = this.props.person;

    return (
      <Card style={styles.card}>
        <Flex value={1} direction={'row'}>
          <Flex value={1} direction={'column'}>
            <Text style={styles.name}>{full_name.toUpperCase()}</Text>
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
                {likes_count > 0 ? likes_count : null}
              </Text>
              <IconButton
                name="likeActiveIcon"
                type="MissionHub"
                onPress={this.onPressLikeIcon}
                style={[styles.icon, styles.likeActive]}
              />
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }
}
