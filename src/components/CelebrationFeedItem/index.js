import React, { Component } from 'react';
import { View, Text } from 'react-native';

import DateComponent from '../DateComponent';
import Card from '../Card';

import styles from './styles';

/*
date
message
heart "like" icon
# of likes
 */
class MemberCelebrate extends Component {
  message = () => {
    const { celebratable, person } = this.props;
    const { object_type, adjective_attribute_value } = celebratable;
    if (object_type === 'interaction') {
      return `${person.first_name} had a spiritual conversation with.`;
    }

    return 'Something else happened';
  };

  render() {
    const { celebratable, person } = this.props;
    const { row, name, time } = styles;
    return (
      <Card style={row}>
        <Text style={name}>{person.full_name.toUpperCase()}</Text>
        <DateComponent
          style={time}
          date={celebratable.changed_attribute_value}
          format="hh:mm a"
        />
        <Text>{this.message()}</Text>
      </Card>
    );
  }
}

export default MemberCelebrate;
