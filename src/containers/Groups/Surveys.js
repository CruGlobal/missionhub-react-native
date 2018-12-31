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
import OnboardingCard, { GROUP_ONBOARDING_TYPES } from './OnboardingCard';

@translate('groupsSurveys')
class Surveys extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    if (this.props.surveys.length === 0) {
      this.load();
    }
  }

  load = () => {
    const { dispatch, organization } = this.props;
    return dispatch(getOrgSurveys(organization.id));
  };

  handleRefresh = () => {
    refresh(this, this.load);
  };

  handleSelect = survey => {
    const { dispatch, organization } = this.props;
    dispatch(
      navigatePush(GROUPS_SURVEY_CONTACTS, {
        organization,
        survey,
      }),
    );
  };

  handleLoadMore = () => {
    const { dispatch, organization } = this.props;
    dispatch(getOrgSurveysNextPage(organization.id));
  };

  keyExtractor = i => i.id;

  renderItem = ({ item }) => (
    <GroupSurveyItem survey={item} onSelect={this.handleSelect} />
  );

  renderHeader = () => <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />;

  render() {
    const { surveys, pagination } = this.props;
    return (
      <Flex value={1}>
        <FlatList
          data={surveys}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={this.keyExtractor}
          style={styles.flatList}
          renderItem={this.renderItem}
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

const mapStateToProps = ({ organizations }, { organization = {} }) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;
  return {
    // organizations may have _placeholder surveys until the mounting request is completed
    surveys: (selectorOrg.surveys || []).filter(s => !s._placeHolder),
    pagination: organizations.surveysPagination,
  };
};

export default connect(mapStateToProps)(Surveys);
