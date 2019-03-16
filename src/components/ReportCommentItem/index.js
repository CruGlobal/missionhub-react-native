import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Card, Button } from '../../components/common';
import CommentItem from '../../containers/CommentItem';

import styles from './styles';

class ReportCommentItem extends Component {
  ignore = () => this.props.onIgnore(this.props.item);
  delete = () => this.props.onDelete(this.props.item);

  render() {
    let {
      item: { comment, person },
    } = this.props;
    // TODO: Remove this and use the comment logic instead
    comment = {
      id: comment.id,
      content: 'Test comment reported',
      person,
      created_at: '2019-03-16T10:15:00',
    };

    const reportedBy = `${person.first_name} ${person.last_name}`;
    const commentBy = `${person.first_name} ${person.last_name}`;

    return (
      <Card style={styles.card}>
        <Flex direction="row" style={styles.users}>
          <Flex value={1}>
            <Text style={styles.label}>Reported By:</Text>
            <Text style={styles.user} numberOfLines={1}>
              {reportedBy}
            </Text>
          </Flex>
          <Flex value={1}>
            <Text style={styles.label}>Comment By:</Text>
            <Text style={styles.user} numberOfLines={1}>
              {commentBy}
            </Text>
          </Flex>
        </Flex>
        <Flex style={styles.comment}>
          <CommentItem item={comment} isPressable={false} />
        </Flex>
        <Flex direction="row" style={styles.buttons}>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.ignore}
              text={'IGNORE'}
              style={[styles.button, styles.buttonLeft]}
            />
          </Flex>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.delete}
              text={'DELETE'}
              style={[styles.button, styles.buttonRight]}
            />
          </Flex>
        </Flex>
      </Card>
    );
  }
}

ReportCommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  onIgnore: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ReportCommentItem;
