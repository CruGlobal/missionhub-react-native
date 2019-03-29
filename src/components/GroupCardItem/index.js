import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Flex, Card, Button, Icon } from '../common';
import DEFAULT_MISSIONHUB_IMAGE from '../../../assets/images/impactBackground.png';
import GLOBAL_COMMUNITY_IMAGE from '../../../assets/images/globalCommunityImage.png';
import Dot from '../Dot';
import { getFirstNameAndLastInitial } from '../../utils/common';
import { GLOBAL_COMMUNITY_ID } from '../../constants';

import styles from './styles';

@translate('groupItem')
export default class GroupCardItem extends Component {
  handlePress = () => {
    const { onPress, group } = this.props;
    onPress(group);
  };
  handleJoin = () => {
    const { onJoin, group } = this.props;
    onJoin(group);
  };

  renderInfo() {
    const { t, group, onJoin } = this.props;
    const owner = group.owner;
    const { contactsCount = 0, unassignedCount = 0, memberCount = 0 } =
      group.contactReport || {};

    if (onJoin) {
      return (
        <Text style={styles.groupNumber}>
          {owner
            ? t('owner', {
                name: getFirstNameAndLastInitial(
                  owner.first_name,
                  owner.last_name,
                ),
              })
            : group.user_created
              ? t('privateGroup')
              : ''}
        </Text>
      );
    }
    if (group.user_created) {
      return (
        <Text style={styles.groupNumber}>
          {t('numMembers', { count: memberCount })}
        </Text>
      );
    }
    return (
      <Text style={styles.groupNumber}>
        {t('numContacts', { count: contactsCount })}
        <Dot />
        {t('numUnassigned', { count: unassignedCount })}
      </Text>
    );
  }

  getSource() {
    const { group } = this.props;
    if (group.community_photo_url) {
      return { uri: group.community_photo_url };
    } else if (group.id === GLOBAL_COMMUNITY_ID) {
      return GLOBAL_COMMUNITY_IMAGE;
    } else if (group.user_created) {
      return undefined;
    } else {
      return DEFAULT_MISSIONHUB_IMAGE;
    }
  }

  render() {
    const { t, group, onPress, onJoin } = this.props;
    const source = this.getSource();

    // TODO: Figure this out from the API
    const hasNotification = group.has_unread_comments_for_user;

    //not passing a value for onPress to Card makes the card unclickable.
    //In some cases we want to prevent clicking on GroupCardItem.
    return (
      <Card
        onPress={onPress ? this.handlePress : undefined}
        style={styles.card}
      >
        <Flex
          value={1}
          style={[
            styles.content,
            group.user_created && group.id !== GLOBAL_COMMUNITY_ID
              ? styles.userCreatedContent
              : undefined,
          ]}
        >
          {source ? (
            <Image source={source} resizeMode="cover" style={styles.image} />
          ) : null}
          <Flex justify="center" direction="row" style={styles.infoWrap}>
            <Flex value={1}>
              <Text style={styles.groupName}>{group.name.toUpperCase()}</Text>
              {this.renderInfo()}
            </Flex>
            {onJoin ? (
              <Flex direction="column" justify="center">
                <Button
                  type="transparent"
                  style={[styles.joinButton]}
                  buttonTextStyle={styles.joinButtonText}
                  text={t('join').toUpperCase()}
                  onPress={this.handleJoin}
                />
              </Flex>
            ) : null}
            {!onJoin && hasNotification ? (
              <Flex align="center" justify="center">
                <Icon
                  type="MissionHub"
                  name="bellIcon"
                  size={20}
                  style={styles.notificationIcon}
                />
                <View style={styles.badge} />
              </Flex>
            ) : null}
          </Flex>
        </Flex>
      </Card>
    );
  }
}

GroupCardItem.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.object,
    contactReport: PropTypes.object,
    user_created: PropTypes.bool,
  }).isRequired,
  onPress: PropTypes.func,
  onJoin: PropTypes.func,
};
