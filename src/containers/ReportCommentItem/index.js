import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Flex, Card, Button } from '../../components/common';
import CommentItem from '../CommentItem';
import ReportCommentLabel from '../../components/ReportCommentLabel';
import {
  ignoreReportComment,
  deleteCelebrateComment,
  getReportedComments,
} from '../../actions/celebrateComments';

import styles from './styles';

@translate('reportComment')
class ReportCommentItem extends Component {
  handleIgnore = async () => {
    const { item, dispatch, organization } = this.props;
    await dispatch(ignoreReportComment(organization.id, item.id));
    await dispatch(getReportedComments(organization.id));
  };

  handleDelete = () => {
    const { t, item, dispatch, organization } = this.props;
    Alert.alert(t('deleteTitle'), '', [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('ok'),
        onPress: async () => {
          await dispatch(
            deleteCelebrateComment(
              organization.id,
              item.comment.organization_celebration_item,
              item.comment,
            ),
          );
          await dispatch(getReportedComments(organization.id));
        },
      },
    ]);
  };

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
          <ReportCommentLabel label={t('reportedBy')} user={reportedBy} />
          <ReportCommentLabel label={t('commentBy')} user={commentBy} />
        </Flex>
        <Flex style={styles.comment}>
          <CommentItem item={comment} isReported={true} />
        </Flex>
        <Flex direction="row" style={styles.buttons}>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.handleIgnore}
              text={t('ignore')}
              style={[styles.button, styles.buttonLeft]}
            />
          </Flex>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.handleDelete}
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
  organization: PropTypes.object.isRequired,
};

export default connect()(ReportCommentItem);
