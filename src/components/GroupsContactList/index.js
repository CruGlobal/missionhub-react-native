import React, { Component } from 'react';
import { Image, FlatList } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import SEARCH_NULL from '../../../assets/images/searchNull.png';
import { Flex, Text, Button } from '../../components/common';
import GroupsContactItem from '../../components/GroupsContactItem';

import styles from './styles';

@translate('groupsContactList')
class GroupsContactList extends Component {
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
        keyExtractor={i => i.id}
        renderItem={({ item }) => <GroupsContactItem item={item} />}
        contentContainerStyle={styles.list}
      />
    );
  }

  render() {
    const { t, person, onAssign } = this.props;

    return (
      <Flex value={1}>
        <Flex style={styles.header} align="center" justify="center">
          <Text style={styles.name}>{person.full_name.toUpperCase()}</Text>
          <Button
            type="transparent"
            onPress={onAssign}
            text={t('assign').toUpperCase()}
            style={styles.assignButton}
            buttonTextStyle={styles.assignButtonText}
          />
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
  onAssign: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
};

export default GroupsContactList;
