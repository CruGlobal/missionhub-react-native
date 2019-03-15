import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../actions/celebrateComments';
import { celebrateCommentsCommentSelector } from '../../selectors/celebrateComments';
import { Flex, Text } from '../../components/common';

import styles from './styles';

class CelebrateCommentBox extends Component {
  render() {
    return (
      <Flex style={styles.card}>
        <Text>Report Item</Text>
      </Flex>
    );
  }
}

CelebrateCommentBox.propTypes = {
  item: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
};

const mapStateToProps = ({ celebrateComments }, { item }) => ({
  comment: celebrateCommentsCommentSelector(
    { celebrateComments },
    { eventId: item.organization_celebration_item.id, commentId: item.id },
  ),
});

export default connect(mapStateToProps)(CelebrateCommentBox);
