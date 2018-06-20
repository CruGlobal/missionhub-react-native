import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Flex, Text } from '../common';

import styles from './styles';

class PersonHeader extends Component {
  render() {
    const { person } = this.props;
    return (
      <Flex
        value={1}
        style={styles.wrap}
        direction="column"
        align="center"
        justify="center"
        self="stretch"
      >
        <Text style={styles.name}>
          {(person.first_name || '').toUpperCase()}
        </Text>
      </Flex>
    );
  }
}

PersonHeader.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default connect()(PersonHeader);
