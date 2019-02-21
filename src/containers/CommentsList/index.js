import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';

import { celebrationItemSelector } from '../../selectors/celebration';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import theme from '../../theme';
import CardTime from '../../components/CardTime';
import ItemHeaderText from '../../components/ItemHeaderText';
import { Text } from '../../components/common';
import { getCelebrateComments } from '../../actions/celebrateComments';

class CommentsList extends Component {
  componentDidMount() {
    const { dispatch, event } = this.props;

    dispatch(getCelebrateComments(event));
  }

  keyExtractor = i => i.id;

  renderItem({ item }) {
    //todo fix inline styles

    return (
      <View
        style={{
          backgroundColor: theme.lightGrey,
          borderRadius: 8,
          paddingVertical: 5,
          paddingHorizontal: 10,
          marginVertical: 5,
        }}
      >
        <ItemHeaderText
          text={`${item.person.first_name} ${item.person.last_name}`}
        />
        <Text style={{ paddingVertical: 3 }}>{item.content}</Text>
        <CardTime date={item.created_at} />
      </View>
    );
  }

  render() {
    const { celebrateComments } = this.props;

    return (
      <FlatList
        data={celebrateComments}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        style={{
          marginHorizontal: 20,
        }}
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
) => {
  const event = celebrationItemSelector(
    { organizations },
    { eventId, organizationId },
  );

  return {
    event,
    celebrateComments: celebrateCommentsSelector(
      { celebrateComments },
      { eventId },
    ).comments,
  };
};
export default connect(mapStateToProps)(CommentsList);
