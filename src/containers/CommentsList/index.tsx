import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { Alert, FlatList } from 'react-native';
import { withTranslation } from 'react-i18next';

import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
  deleteCelebrateComment,
  setCelebrateEditingComment,
  resetCelebrateEditingComment,
} from '../../actions/celebrateComments';
import { reportComment } from '../../actions/reportComments';
import LoadMore from '../../components/LoadMore';
import { keyExtractorId, isOwner } from '../../utils/common';
import CommentItem from '../CommentItem';
import { orgPermissionSelector } from '../../selectors/people';

import styles from './styles';

// @ts-ignore
@withTranslation('commentsList')
class CommentsList extends Component {
  componentDidMount() {
    // @ts-ignore
    const { dispatch, event } = this.props;

    dispatch(reloadCelebrateComments(event));
    dispatch(resetCelebrateEditingComment());
  }

  handleLoadMore = () => {
    // @ts-ignore
    const { dispatch, event } = this.props;

    dispatch(getCelebrateCommentsNextPage(event));
  };

  // @ts-ignore
  handleEdit = item => {
    // @ts-ignore
    this.props.dispatch(setCelebrateEditingComment(item.id));
  };

  // @ts-ignore
  alert = ({ title, message, actionText, action }) => {
    // @ts-ignore
    const { t } = this.props;
    Alert.alert(t(title), t(message), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t(actionText),
        onPress: action,
      },
    ]);
  };

  // @ts-ignore
  handleDelete = item => {
    // @ts-ignore
    const { dispatch, event } = this.props;

    this.alert({
      title: 'deletePostHeader',
      message: 'deleteAreYouSure',
      actionText: 'deletePost',
      action: () => {
        dispatch(deleteCelebrateComment(event.organization.id, event, item));
      },
    });
  };

  // @ts-ignore
  handleReport = item => {
    // @ts-ignore
    const { dispatch, event } = this.props;
    this.alert({
      title: 'reportToOwnerHeader',
      message: 'reportAreYouSure',
      actionText: 'reportPost',
      action: () => {
        dispatch(reportComment(event.organization.id, item));
      },
    });
  };

  // @ts-ignore
  menuActions = item => {
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      event: { organization },
      // @ts-ignore
      me,
    } = this.props;

    const actions = [];
    const deleteAction = {
      text: t('deletePost'),
      onPress: () => this.handleDelete(item),
      destructive: true,
    };

    if (me.id === item.person.id) {
      actions.push({
        text: t('editPost'),
        onPress: () => this.handleEdit(item),
      });
      actions.push(deleteAction);
    } else {
      const orgPermission =
        // @ts-ignore
        orgPermissionSelector(null, {
          person: me,
          organization,
        }) || {};
      if (isOwner(orgPermission)) {
        actions.push(deleteAction);
      } else {
        actions.push({
          text: t('reportToOwner'),
          onPress: () => this.handleReport(item),
        });
      }
    }

    return actions;
  };

  // @ts-ignore
  renderItem = ({ item }) => (
    <CommentItem
      item={item}
      // @ts-ignore
      menuActions={this.menuActions(item)}
      // @ts-ignore
      organization={this.props.event.organization}
    />
  );

  render() {
    const {
      // @ts-ignore
      listProps,
      // @ts-ignore
      celebrateComments: { comments, pagination } = {},
    } = this.props;
    const { list, listContent } = styles;

    return (
      <FlatList
        data={comments}
        keyExtractor={keyExtractorId}
        renderItem={this.renderItem}
        style={list}
        contentContainerStyle={listContent}
        ListFooterComponent={
          pagination &&
          pagination.hasNextPage && <LoadMore onPress={this.handleLoadMore} />
        }
        bounces={false}
        {...listProps}
      />
    );
  }
}

// @ts-ignore
CommentsList.propTypes = {
  event: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = ({ auth, celebrateComments }, { event }) => ({
  me: auth.person,
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId: event.id },
  ),
});
export default connect(mapStateToProps)(CommentsList);
