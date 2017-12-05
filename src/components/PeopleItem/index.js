import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Touchable } from '../common';
import styles from './styles';

export default class PeopleItem extends Component {
  handleSelect = () => { this.props.onSelect(this.props.person); }
  render() {
    const { person } = this.props;
    return (
      <Touchable highlight={true} onPress={this.handleSelect}>
        <Flex justify="center" style={styles.row}>
          <Text style={styles.name}>
            {person.id}
          </Text>
          <Text style={styles.stage}>
            {person.body}
          </Text>
        </Flex>
      </Touchable>
    );
  }

}

PeopleItem.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};
