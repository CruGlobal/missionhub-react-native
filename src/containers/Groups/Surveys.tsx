import React, { Component } from 'react';
import { View, FlatList, Linking } from 'react-native';
import { connect } from 'react-redux-legacy';
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
import { InfoModal } from '../../components/InfoModal/InfoModal';

import { GROUPS_SURVEY_CONTACTS } from './SurveyContacts';
import styles from './styles';
import OnboardingCard, { GROUP_ONBOARDING_TYPES } from './OnboardingCard';

// @ts-ignore
@withTranslation('groupsSurveys')
class Surveys extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    // @ts-ignore
    if (this.props.surveys.length === 0) {
      this.load();
    }
  }

  load = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(refreshCommunity(organization.id));
    return dispatch(getOrgSurveys(organization.id));
  };

  handleRefresh = () => {
    refresh(this, this.load);
  };

  // @ts-ignore
  handleSelect = survey => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(
      navigatePush(GROUPS_SURVEY_CONTACTS, {
        organization,
        survey,
      }),
    );
  };

  handleLoadMore = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(getOrgSurveysNextPage(organization.id));
  };

  // @ts-ignore
  renderItem = ({ item }) => (
    // @ts-ignore
    <GroupSurveyItem survey={item} onSelect={this.handleSelect} />
  );

  // @ts-ignore
  renderHeader = () => <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />;

  render() {
    // @ts-ignore
    const { surveys, pagination, organization, t } = this.props;
    return (
      <View style={styles.pageContainer}>
        <InfoModal
          title={t('movingToWeb')}
          titleStyle={{ maxWidth: 200 }}
          buttonLabel={t('findThemHere').toUpperCase()}
          action={() =>
            Linking.openURL(
              `https://missionhub.com/ministries/${organization.id}/surveyResponses`,
            )
          }
        />
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
      </View>
    );
  }
}

// @ts-ignore
Surveys.propTypes = {
  organization: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = ({ organizations }, { orgId }) => {
  const organization = organizationSelector({ organizations }, { orgId });

  return {
    // organizations may have _placeholder surveys until the mounting request is completed
    // @ts-ignore
    surveys: (organization.surveys || []).filter(s => !s._placeHolder),
    pagination: organizations.surveysPagination,
    organization,
  };
};

export default connect(mapStateToProps)(Surveys);
