import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Touchable } from '../common';
import styles from './styles';

export default class SearchPeopleItem extends Component {
  handleSelect = () => {
    const { person } = this.props;
    let org;
    if (person && person.organization) {
      org = person.organization;
    }
    this.props.onSelect(this.props.person, org );
  }

  render() {
    const { person } = this.props;

    let orgName;
    if (person && person.organization) {
      orgName = person.organization.name;
    }

    return (
      <Touchable highlight={true} onPress={this.handleSelect}>
        <Flex justify="center" style={styles.row}>
          <Text style={styles.name}>
            {person.first_name}
            {person.last_name ? ` ${person.last_name}` : null}
          </Text>
          <Text style={styles.organization}>
            {orgName}
          </Text>
        </Flex>
      </Touchable>
    );
  }
}

SearchPeopleItem.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};
