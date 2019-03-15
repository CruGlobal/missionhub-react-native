import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, FlatList } from 'react-native';
import { translate } from 'react-i18next';

import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
  deleteCelebrateComment,
  setCelebrateEditingComment,
  resetCelebrateEditingComment,
  reportComment,
} from '../../actions/celebrateComments';
import LoadMore from '../../components/LoadMore';
import RefreshControl from '../../components/RefreshControl';
import { refresh, showMenu } from '../../utils/common';
import CommentItem from '../CommentItem';
import { orgPermissionSelector } from '../../selectors/people';
import { ORG_PERMISSIONS } from '../../constants';

import styles from './styles';

@translate('commentsList')
class CommentsList extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    this.refreshComments();
    this.props.dispatch(resetCelebrateEditingComment());
  }

  refreshComments = () => {
    const { dispatch, event } = this.props;

    return dispatch(reloadCelebrateComments(event));
  };

  handleRefresh = () => refresh(this, this.refreshComments);

  handleLoadMore = () => {
    const { dispatch, event } = this.props;

    dispatch(getCelebrateCommentsNextPage(event));
  };

  handleEdit = item => {
    this.props.dispatch(setCelebrateEditingComment(item.id));
  };

  alert = ({ title, message, actionText, action }) => {
    const { t } = this.props;
    Alert.alert(title, message, [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: actionText,
        onPress: action,
      },
    ]);
  };

  handleDelete = item => {
    const { t, dispatch, event } = this.props;

    this.alert({
      title: t('deletePostHeader'),
      message: t('deleteAreYouSure'),
      actionText: t('deletePost'),
      action: () => {
        dispatch(deleteCelebrateComment(event, item));
      },
    });
  };

  handleReport = item => {
    const { t, dispatch, event } = this.props;
    this.alert({
      title: t('reportToOwnerHeader'),
      message: t('reportAreYouSure'),
      actionText: t('reportPost'),
      action: () => {
        dispatch(reportComment(event, item));
      },
    });
  };

  keyExtractor = i => i.id;

  handleLongPress = (item, componentRef) => {
    const {
      t,
      event: { organization },
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
        orgPermissionSelector(null, {
          person: me,
          organization,
        }) || {};
      if (orgPermission.permission_id === ORG_PERMISSIONS.ADMIN) {
        actions.push(deleteAction);
      } else {
        actions.push({
          text: t('reportToOwner'),
          onPress: () => this.handleReport(item),
        });
      }
    }

    showMenu(actions, componentRef);
  };

  renderItem = ({ item }) => (
    <CommentItem
      item={item}
      onLongPress={this.handleLongPress}
      organization={this.props.event.organization}
    />
  );

  render() {
    const { celebrateComments: { comments, pagination } = {} } = this.props;
    const { list } = styles;

    return (
      <FlatList
        data={comments}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        style={list}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        ListFooterComponent={
          pagination &&
          pagination.hasNextPage && <LoadMore onPress={this.handleLoadMore} />
        }
      />
    );
  }
}

CommentsList.propTypes = {
  event: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, celebrateComments }, { event }) => ({
  me: auth.person,
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId: event.id },
  ),
});
export default connect(mapStateToProps)(CommentsList);
