import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Card, Button } from '../../components/common';
import CommentItem from '../../containers/CommentItem';

import styles from './styles';

@translate('reportComment')
class ReportCommentItem extends Component {
  ignore = () => this.props.onIgnore(this.props.item);
  delete = () => this.props.onDelete(this.props.item);

  render() {
    const {
      t,
      item: { comment, person },
    } = this.props;

    const reportedBy = person.full_name;
    const commentBy = comment.person.full_name;

    return (
      <Card style={styles.card}>
        <Flex direction="row" style={styles.users}>
          <Flex value={1}>
            <Text style={styles.label}>{t('reportedBy')}:</Text>
            <Text style={styles.user} numberOfLines={1}>
              {reportedBy}
            </Text>
          </Flex>
          <Flex value={1}>
            <Text style={styles.label}>{t('commentBy')}:</Text>
            <Text style={styles.user} numberOfLines={1}>
              {commentBy}
            </Text>
          </Flex>
        </Flex>
        <Flex style={styles.comment}>
          <CommentItem item={comment} isReported={true} />
        </Flex>
        <Flex direction="row" style={styles.buttons}>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.ignore}
              text={t('ignore')}
              style={[styles.button, styles.buttonLeft]}
            />
          </Flex>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.delete}
              text={t('delete')}
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
