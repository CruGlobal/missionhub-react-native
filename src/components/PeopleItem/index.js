import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Touchable } from '../common';
import styles from './styles';

export default class PeopleItem extends Component {
  handleSelect = () => { this.props.onSelect(this.props.person); }
  render() {
    const { person, isMe } = this.props;
    let personName = isMe ? 'Me' : person.full_name || '';
    personName = personName.toUpperCase();

    return (
      <Touchable highlight={true} onPress={this.handleSelect}>
        <Flex justify="center" style={styles.row}>
          <Text style={styles.name}>
            {personName}
          </Text>
          <Text style={styles.stage}>
            {person.id}
          </Text>
        </Flex>
      </Touchable>
    );
  }

}

PeopleItem.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    gender: PropTypes.string,
    student_status: PropTypes.string,
    campus: PropTypes.string,
    year_in_school: PropTypes.string,
    major: PropTypes.string,
    minor: PropTypes.string,
    birth_date: PropTypes.string,
    date_became_christian: PropTypes.string,
    graduation_date: PropTypes.string,
    picture: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  isMe: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};
