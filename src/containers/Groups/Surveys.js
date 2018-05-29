import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Separator } from '../../components/common';
import GroupSurveyItem from '../../components/GroupSurveyItem';
import LoadMore from '../../components/LoadMore';

import styles from './styles';

@connect()
@translate('groupsSurveys')
class Surveys extends Component {
  handleSelect = survey => {
    LOG('selected survey', survey);
  };

  handleLoadMore = () => {
    LOG('load more');
  };

  render() {
    const { surveys, hasMore } = this.props;
    return (
      <Flex value={1} style={styles.surveys}>
        <FlatList
          data={surveys}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <GroupSurveyItem survey={item} onSelect={this.handleSelect} />
          )}
          ListFooterComponent={
            hasMore ? <LoadMore onPress={this.handleLoadMore} /> : undefined
          }
        />
      </Flex>
    );
  }
}

const mapStateToProps = () => ({
  surveys: [
    {
      id: '1',
      created_at: '2018-05-29T17:02:02Z',
      survey: { title: 'Winter Conference 2018' },
      contactNum: 2,
      uncontactedNum: 3,
      unassignedNum: 5,
    },
    {
      id: '2',
      created_at: '2018-05-28T17:02:02Z',
      survey: { title: 'Freshmen Week 17' },
      contactNum: 50,
      uncontactedNum: 0,
      unassignedNum: 0,
    },
    {
      id: '3',
      created_at: '2018-05-28T17:02:02Z',
      survey: { title: 'Freshmen Week 18' },
      contactNum: 50,
      uncontactedNum: 0,
      unassignedNum: 38,
    },
    {
      id: '4',
      created_at: '2018-05-28T17:02:02Z',
      survey: { title: 'Another Conference for Cru, number 4' },
      contactNum: 50,
      uncontactedNum: 30,
      unassignedNum: 0,
    },
  ],
  hasMore: true,
});

export default connect(mapStateToProps)(Surveys);
