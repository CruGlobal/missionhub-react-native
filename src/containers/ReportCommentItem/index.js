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

@withTranslation('reportComment')
class ReportCommentItem extends Component {
  handleIgnore = async () => {
    const { item, dispatch, organization } = this.props;
    await dispatch(ignoreReportComment(organization.id, item.id));
    await dispatch(getReportedComments(organization.id));
  };

  getContentCreator = content => {
    const { typeName, person, author } = content;

    switch (typeName) {
      case 'Story':
        return author.fullName;
      case 'CommunityCelebrationItemComment':
        return person.fullName;
      default:
        return person.fullName;
    }
  };

  getContentType = content => {
    const { typeName } = content;

    switch (typeName) {
      case 'Story':
        return 'storyBy';
      case 'CommunityCelebrationItemComment':
        return 'commentBy';
      default:
        return 'commentBy';
    }
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
      item: { subject, person },
    } = this.props;

    const reportedBy = person.fullName;
    const commentBy = this.getContentCreator(subject);

    return (
      <Card style={styles.card}>
        <Flex direction="row" style={styles.users}>
          <ReportCommentLabel label={t('reportedBy')} user={reportedBy} />
          <ReportCommentLabel
            label={t(`${this.getContentType(subject)}`)}
            user={commentBy}
          />
        </Flex>
        <Flex style={styles.comment}>
          <CommentItem item={subject} isReported={true} />
        </Flex>
        <Flex direction="row" style={styles.buttons}>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.handleIgnore}
              text={t('ignore').toUpperCase()}
              style={[styles.button, styles.buttonLeft]}
            />
          </Flex>
          <Flex value={1}>
            <Button
              type="secondary"
              onPress={this.handleDelete}
              text={t('delete').toUpperCase()}
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
