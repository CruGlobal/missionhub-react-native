import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';

import { celebrationItemSelector } from '../../selectors/celebration';
import theme from '../../theme';
import CardTime from '../../components/CardTime';
import ItemHeaderText from '../../components/ItemHeaderText';
import { Text } from '../../components/common';

const comments = [
  {
    text: 'Bill T. completed a Step of Faith with a Curious person.',
    id: '1',
    person: { first_name: 'Roge', last_name: 'Goers' },
    created_at: '2019-08-16T15:56:38Z',
  }, //todo load people from selector or comment object?
  {
    text: 'daisy is number two',
    id: '2',
    person: { first_name: 'The', last_name: 'Dummy' },
    created_at: '2019-08-16T15:56:38Z',
  },
];

class CommentsList extends Component {
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
        <Text style={{ paddingVertical: 3 }}>{item.text}</Text>
        <CardTime date={item.created_at} />
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={comments}
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

const mapStateToProps = ({ organizations }, { eventId, organizationId }) => ({
  event: celebrationItemSelector(
    { organizations },
    { eventId, organizationId },
  ),
});
export default connect(mapStateToProps)(CommentsList);
