import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text } from '../common';
import styles from './styles';
import PillButton from '../PillButton';

export default class ContactHeader extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { name } = this.props;

    return (
      <Flex style={styles.wrap} direction="column" align="center" justify="center">
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <PillButton
          filled={true}
          text="STAGE"
          style={styles.stageBtn}
          buttonTextStyle={styles.stageBtnText}
          onPress={()=>{}}
        />
      </Flex>
    );
  }
}

ContactHeader.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
