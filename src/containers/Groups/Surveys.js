import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex } from '../../components/common';
import GroupSurveyItem from '../../components/GroupSurveyItem';
import LoadMore from '../../components/LoadMore';
import { navigatePush } from '../../actions/navigation';
import { getOrgSurveys } from '../../actions/surveys';

import { GROUPS_SURVEY_CONTACTS } from './SurveyContacts';
import styles from './styles';

@connect()
@translate('groupsSurveys')
class Surveys extends Component {
  componentDidMount() {
    const { dispatch, organization } = this.props;
    dispatch(getOrgSurveys(organization.id));
  }

  handleSelect = survey => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_SURVEY_CONTACTS, { organization, survey }));
  };

  handleLoadMore = () => {
    return true;
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

Surveys.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ groups }) => ({
  surveys: groups.surveys,
  hasMore: true,
});

export default connect(mapStateToProps)(Surveys);
