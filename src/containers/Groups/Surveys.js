import React, { Component } from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { RefreshControl } from '../../components/common';
import { refresh, keyExtractorId } from '../../utils/common';
import GroupSurveyItem from '../../components/GroupSurveyItem';
import LoadMore from '../../components/LoadMore';
import { navigatePush } from '../../actions/navigation';
import { getOrgSurveys, getOrgSurveysNextPage } from '../../actions/surveys';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';

import { GROUPS_SURVEY_CONTACTS } from './SurveyContacts';
import styles from './styles';
import OnboardingCard, { GROUP_ONBOARDING_TYPES } from './OnboardingCard';

@withTranslation('groupsSurveys')
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
    dispatch(refreshCommunity(organization.id));
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

  renderItem = ({ item }) => (
    <GroupSurveyItem survey={item} onSelect={this.handleSelect} />
  );

  renderHeader = () => <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />;

  render() {
    const { surveys, pagination } = this.props;
    return (
      <SafeAreaView style={styles.pageContainer}>
        <FlatList
          data={surveys}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={keyExtractorId}
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
      </SafeAreaView>
    );
  }
}

Surveys.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ organizations }, { orgId }) => {
  const organization = organizationSelector({ organizations }, { orgId });

  return {
    // organizations may have _placeholder surveys until the mounting request is completed
    surveys: (organization.surveys || []).filter(s => !s._placeHolder),
    pagination: organizations.surveysPagination,
    organization,
  };
};

export default connect(mapStateToProps)(Surveys);
