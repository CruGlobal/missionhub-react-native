import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Icon, DateComponent, Card } from '../../components/common';
import { getIconName } from '../../utils/common';

import styles from './styles';

class GroupsContactItem extends Component {
  render() {
    const { item } = this.props;
    if (item.survey) {
      return <Text>Survey Item</Text>;
    }
    let iconType =
      getIconName(item.type, item.interaction_type_id) || 'surveyIcon';
    return (
      <Card style={styles.row}>
        <Flex value={1} align="center">
          <Icon
            name={iconType}
            type="MissionHub"
            size={32}
            style={styles.icon}
          />
        </Flex>
        <Flex value={5} style={styles.rowContent}>
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
}

GroupsContactItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default GroupsContactItem;
