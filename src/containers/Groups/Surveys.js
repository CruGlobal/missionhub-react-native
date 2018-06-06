import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, RefreshControl } from '../../components/common';
import { refresh } from '../../utils/common';
import GroupSurveyItem from '../../components/GroupSurveyItem';
import LoadMore from '../../components/LoadMore';
import { navigatePush } from '../../actions/navigation';
import { getOrgSurveys, getOrgSurveysNextPage } from '../../actions/surveys';
import { organizationSelector } from '../../selectors/organizations';

import { GROUPS_SURVEY_CONTACTS } from './SurveyContacts';
import styles from './styles';

@translate('groupsSurveys')
class Surveys extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    this.load();
  }

  load() {
    const { dispatch, organization } = this.props;
    return dispatch(getOrgSurveys(organization.id));
  }

  handleRefresh = () => {
    refresh(this, this.load);
  };

  handleSelect = survey => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_SURVEY_CONTACTS, { organization, survey }));
  };

  handleLoadMore = () => {
    const { dispatch, organization } = this.props;
    dispatch(getOrgSurveysNextPage(organization.id));
  };

  render() {
    const { surveys, pagination } = this.props;
    return (
      <Flex value={1} style={styles.surveys}>
        <FlatList
          data={surveys}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <GroupSurveyItem survey={item} onSelect={this.handleSelect} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          ListFooterComponent={
            pagination.hasNextPage ? (
              <LoadMore onPress={this.handleLoadMore} />
            ) : (
              undefined
            )
          }
        />
      </Flex>
    );
  }
}

Surveys.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );
  return {
    surveys: (selectorOrg || {}).surveys || [],
    pagination: organizations.surveysPagination,
  };
};

export default connect(mapStateToProps)(Surveys);
