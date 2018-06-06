import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button, Flex, DateComponent } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import LoadMore from '../../components/LoadMore';

import styles from './styles';

@translate('groupsCelebrate')
export class Celebrate extends Component {
  handleLoadMore = () => {
    return true;
  };

  renderSection(item) {
    return (
      <Flex align="center" justify="center" style={styles.cardSectionHeader}>
        <DateComponent
          date={item.date}
          style={styles.cardSectionText}
          format="dddd, MMMM D"
        />
        {item.events
          ? item.events.map(event => (
              <CelebrateItem key={event.id} event={event} />
            ))
          : null}
      </Flex>
    );
  }

  render() {
    return (
      <Flex value={1}>
        <FlatList
          data={this.props.items}
          keyExtractor={i => i.id}
          renderItem={({ item }) => this.renderSection(item)}
          style={styles.cardList}
          inverted={true}
          ListFooterComponent={<LoadMore onPress={this.handleLoadMore} />}
        />
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={() => {}}
            text={'Input goes here'}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = () => ({
  items: [
    {
      date: '2018-04-11 19:06:00 UTC',
      id: '1',
      events: [
        {
          id: '1',
          full_name: 'Matt Watts',
          changed_attribute_value: '2018-04-11 19:06:00 UTC',
          title: 'Matt had a Discipleship Conversation',
          likes_count: '3',
        },
      ],
    },
    {
      date: '2018-04-10 07:06:00 UTC',
      id: '2',
      events: [
        {
          id: '2',
          full_name: 'Emma Frost',
          changed_attribute_value: '2018-04-10 17:32:00 UTC',
          title: 'Matt added a Curious person',
          likes_count: '5',
        },
        {
          id: '3',
          full_name: 'Emma Frost',
          changed_attribute_value: '2018-04-10 07:06:00 UTC',
          title: 'Emma had a Spiritual Conversation',
          likes_count: '3',
        },
      ],
    },
    {
      date: '2018-04-09 15:23:00 UTC',
      id: '3',
      events: [
        {
          id: '4',
          full_name: 'Leah Brooks',
          changed_attribute_value: '2018-04-09 15:23:00 UTC',
          title: 'Leah completed a Step of Faith with a Curious person',
          likes_count: '0',
        },
      ],
    },
  ],
});

export default connect(mapStateToProps)(Celebrate);
