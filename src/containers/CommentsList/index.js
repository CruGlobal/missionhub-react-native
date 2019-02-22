import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';

import { celebrationItemSelector } from '../../selectors/celebration';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import CardTime from '../../components/CardTime';
import ItemHeaderText from '../../components/ItemHeaderText';
import { Text } from '../../components/common';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
} from '../../actions/celebrateComments';
import LoadMore from '../../components/LoadMore';
import RefreshControl from '../../components/RefreshControl';
import { refresh } from '../../utils/common';

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

  renderItem({ item }) {
    const { itemStyle, text } = styles;

    return (
      <View style={itemStyle}>
        <ItemHeaderText
          text={`${item.person.first_name} ${item.person.last_name}`}
        />
        <Text style={text}>{item.content}</Text>
        <CardTime date={item.created_at} />
      </View>
    );
  }

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

const mapStateToProps = (
  { organizations, celebrateComments },
  { eventId, organizationId },
) => ({
  event: celebrationItemSelector(
    { organizations },
    { eventId, organizationId },
  ),
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId },
  ),
});
export default connect(mapStateToProps)(CommentsList);
