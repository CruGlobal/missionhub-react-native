import React, { Component } from 'react';
import connect from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Flex, Card } from '../common';
import { navigatePush } from '../../actions/navigation';

export class GroupCardItem extends Component {
  handlePress = step => {};

  render() {
    const {
      step: { title = '' },
    } = this.props;

    return (
      <Card onPress={this.handlePress}>
        <Text>title</Text>
      </Card>
    );
  }
}

GroupCardItem.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string.isRequired(),
  }).isRequired,
};

export default connect()(GroupCardItem);
