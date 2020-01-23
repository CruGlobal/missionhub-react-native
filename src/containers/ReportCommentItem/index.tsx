import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux-legacy';

import { Flex, Card, Button } from '../../components/common';
import CommentItem from '../CommentItem';
import ReportCommentLabel from '../../components/ReportCommentLabel';
import { deleteCelebrateComment } from '../../actions/celebrateComments';
import {
  ignoreReportComment,
  getReportedComments,
} from '../../actions/reportComments';

import styles from './styles';

// @ts-ignore
@withTranslation('reportComment')
class ReportCommentItem extends Component {
  handleIgnore = async () => {
    // @ts-ignore
    const { item, dispatch, organization } = this.props;
    await dispatch(ignoreReportComment(organization.id, item.id));
    await dispatch(getReportedComments(organization.id));
  };

  handleDelete = () => {
    // @ts-ignore
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
      // @ts-ignore
      t,
      // @ts-ignore
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
          {/* 
          // @ts-ignore */}
          <CommentItem item={comment} isReported={true} />
        </Flex>
        {/* 
        // @ts-ignore */}
        <Flex direction="row" style={styles.buttons}>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.handleIgnore}
              text={t('ignore').toUpperCase()}
              // @ts-ignore
              style={[styles.button, styles.buttonLeft]}
            />
          </Flex>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.handleDelete}
              text={t('delete').toUpperCase()}
              // @ts-ignore
              style={[styles.button, styles.buttonRight]}
            />
          </Flex>
        </Flex>
      </Card>
    );
  }
}

// @ts-ignore
ReportCommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default connect()(ReportCommentItem);
