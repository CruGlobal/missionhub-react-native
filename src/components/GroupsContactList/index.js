import React, { Component } from 'react';
import { Image, FlatList } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import SEARCH_NULL from '../../../assets/images/searchNull.png';
import {
  Flex,
  Text,
  Icon,
  Button,
  DateComponent,
  Card,
} from '../../components/common';

import styles from './styles';

@translate('groupsContactList')
class GroupsContactList extends Component {
  renderItem({ item }) {
    if (item.survey) {
      return <Text>Survey Item</Text>;
    }
    return (
      <Card style={styles.row}>
        <Flex value={1}>
          <Icon
            name="surveyIcon"
            type="MissionHub"
            size={32}
            style={styles.icon}
          />
        </Flex>
        <Flex value={3.5} style={styles.rowContent}>
          <DateComponent
            date={item.created_at}
            style={styles.date}
            format="LLL"
          />
          <Text style={styles.title}>{item.text}</Text>
          {item.comment ? (
            <Text style={styles.comment}>{item.comment}</Text>
          ) : null}
        </Flex>
      </Card>
    );
  }

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
        renderItem={this.renderItem}
        style={styles.list}
      />
    );
  }

  render() {
    const { t, person, onAssign } = this.props;

    return (
      <Flex value={1}>
        <Flex style={styles.header}>
          <Text style={styles.name}>{person.name}</Text>
          <Button type="primary" onPress={onAssign} text={t('assign')} />
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
