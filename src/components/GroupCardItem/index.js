import React, { Component, Fragment } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Flex, Card, Button } from '../common';
import DEFAULT_MISSIONHUB_IMAGE from '../../../assets/images/impactBackground.png';
// TODO: Need the correct default image for user created communities
import DEFAULT_USER_COMMUNITY_IMAGE from '../../../assets/images/impactBackground.png';
import Dot from '../Dot';

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
          {t('numMembers', { count: memberCount })}
          {owner ? (
            <Fragment>
              <Dot />
              <Text style={styles.groupNumber}>
                {t('owner', {
                  name: `${owner.first_name} ${(owner.last_name || '').charAt(
                    0,
                  )}`,
                })}
              </Text>
            </Fragment>
          ) : null}
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

  render() {
    const { t, group, onPress, onJoin } = this.props;
    let source;
    if (group.community_photo_url) {
      source = { url: group.community_photo_url };
    } else if (group.user_created) {
      source = DEFAULT_USER_COMMUNITY_IMAGE;
    } else {
      source = DEFAULT_MISSIONHUB_IMAGE;
    }

    //not passing a value for onPress to Card makes the card unclickable.
    //In some cases we want to prevent clicking on GroupCardItem.
    return (
      <Card
        onPress={onPress ? this.handlePress : undefined}
        style={styles.card}
      >
        <Image source={source} resizeMode="cover" style={styles.image} />
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
        </Flex>
      </Card>
    );
  }
}

GroupCardItem.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.object,
    contactReport: PropTypes.object.isRequired,
    user_created: PropTypes.bool,
  }).isRequired,
  onPress: PropTypes.func,
  onJoin: PropTypes.func,
};
