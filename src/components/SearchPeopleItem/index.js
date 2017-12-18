import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Touchable } from '../common';
import styles from './styles';

export default class SearchPeopleItem extends Component {
  handleSelect = () => { this.props.onSelect(this.props.person); }
  render() {
    const { person } = this.props;

    return (
      <Touchable highlight={true} onPress={this.handleSelect}>
        <Flex justify="center" style={styles.row}>
          <Text style={styles.name}>
            {person.full_name}
          </Text>
          <Text style={styles.organization}>
            {person.organization}
          </Text>
        </Flex>
      </Touchable>
    );
  }

}

SearchPeopleItem.propTypes = {
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
  onSelect: PropTypes.func.isRequired,
};
