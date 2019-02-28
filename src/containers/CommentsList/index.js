import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import i18n from 'i18next';

import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
} from '../../actions/celebrateComments';
import LoadMore from '../../components/LoadMore';
import RefreshControl from '../../components/RefreshControl';
import { refresh, showMenu } from '../../utils/common';
import CommentItem from '../../components/CommentItem';
import { orgPermissionSelector } from '../../selectors/people';
import { ORG_PERMISSIONS } from '../../constants';

import styles from './styles';

class CommentsList extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    this.refreshComments();
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

  keyExtractor = i => i.id;

  renderItem = ({ item }) => {
    const props = {
      item: item,
      onLongPress: this.handleLongPress,
      organization: this.props.event.organization,
    };

    if (me.id === item.person.id) {
      return <MeCommentItem {...props} />;
    }

    const orgPermission =
      orgPermissionSelector(null, {
        person: me,
        organization,
      }) || {};

    if (orgPermission.permission_id === ORG_PERMISSIONS.ADMIN) {
      return <AdminCommentItem {...props} />;
    }

    return <OtherCommentItem {...props} />;
  };

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
