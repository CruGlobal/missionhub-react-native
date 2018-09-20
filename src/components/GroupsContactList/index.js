import React, { Component } from 'react';
import { Image, FlatList } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import SEARCH_NULL from '../../../assets/images/searchNull.png';
import { Flex, Text } from '../../components/common';
import GroupsContactItem from '../../components/GroupsContactItem';
import AssignToMeButton from '../AssignToMeButton/index';

import styles from './styles';

@translate('groupsContactList')
class GroupsContactList extends Component {
  keyExtractor = i => `${i.id}-${i._type}`;

  renderItem = ({ item }) => {
    const { person, myId } = this.props;

    return <GroupsContactItem person={person} item={item} myId={myId} />;
  };

  renderContent() {
    const { t, activity } = this.props;

    if (activity.length === 0) {
      return (
        <Flex align="center" justify="center" value={1} style={styles.nullWrap}>
          <Image source={SEARCH_NULL} style={styles.nullImage} />
          <Text type="header" style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>{t('nullDescription')}</Text>
        </Flex>
      );
    }
    return (
      <FlatList
        data={activity}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        contentContainerStyle={styles.list}
      />
    );
  }

  render() {
    const { person, organization } = this.props;
    const name =
      person.full_name ||
      `${person.first_name}${person.last_name ? ` ${person.last_name}` : ''}`;

    return (
      <Flex value={1}>
        <Flex style={styles.header} align="center" justify="center">
          <Text style={styles.name}>{name.toUpperCase()}</Text>
          <AssignToMeButton person={person} organization={organization} />
        </Flex>
        <Flex value={1} style={styles.content}>
          {this.renderContent()}
        </Flex>
      </Flex>
    );
  }
}

GroupsContactList.propTypes = {
  activity: PropTypes.array.isRequired,
  person: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
};

export default GroupsContactList;
