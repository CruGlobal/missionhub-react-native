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

import GREY_HEART from '../../../assets/images/heart-grey.png';
import BLUE_HEART from '../../../assets/images/heart-blue.png';

import styles from './styles';

@translate('celebrateFeeds')
export default class CelebrateItem extends Component {
  onPressLikeIcon = () => {};

  renderMessage() {
    const { t, event } = this.props;

    const name = event.subject_person_name.split(' ')[0];

    switch (event.celebrateable_type) {
      case 'V4::AcceptedChallenge':
        return this.renderStepOfFaithMessage(t, event, name);
      case 'V4::Interaction':
        return t('interaction', {
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
        receiverStage: this.renderStage(),
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
    const {
      changed_attribute_value,
      subject_person_name,
      likes_count,
    } = this.props.event;
    const isLiked = likes_count > 0;

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
                {isLiked ? likes_count : null}
              </Text>
              <Button
                name="likeActiveIcon"
                type="MissionHub"
                onPress={this.onPressLikeIcon}
                style={[styles.icon]}
              >
                <Image source={isLiked ? BLUE_HEART : GREY_HEART} />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }
}
