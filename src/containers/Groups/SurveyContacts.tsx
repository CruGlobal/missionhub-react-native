import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import SearchList from '../../components/SearchList';
import PersonListItem from '../../components/PersonListItem';
import {
  searchRemoveFilter,
  unassignedFilter,
  thirtyDaysFilter,
} from '../../utils/filters';
import { buildTrackingObj } from '../../utils/common';
import Header from '../../components/Header';
import BackButton from '../BackButton';
import { navToPersonScreen } from '../../actions/person';
import { buildUpdatedPagination } from '../../utils/pagination';
import ShareSurveyMenu from '../../components/ShareSurveyMenu';
import { getOrganizationContacts } from '../../actions/organizations';

import styles from './styles';
import { SEARCH_SURVEY_CONTACTS_FILTER_SCREEN } from './SurveyContactsFilter';

// @ts-ignore
@withTranslation('groupsSurveyContacts')
class SurveyContacts extends Component {
  state = {
    pagination: {
      page: 0,
      hasMore: true,
    },
    //Default filters
    filters: {
      // @ts-ignore
      unassigned: unassignedFilter(this.props.t, true),
      // @ts-ignore
      time: thirtyDaysFilter(this.props.t),
    },
    defaultResults: [],
  };

  componentDidMount() {
    // Use the default filters to load in these people
    this.loadContactsWithFilters();
  }

  loadContactsWithFilters = async () => {
    const contacts = await this.handleLoadMore('');
    this.setState({ defaultResults: contacts });
  };

  // @ts-ignore
  handleRemoveFilter = key => {
    // @ts-ignore
    return searchRemoveFilter(this, key, ['unassigned', 'time']);
  };

  handleFilterPress = () => {
    // @ts-ignore
    const { dispatch, survey } = this.props;
    const { filters } = this.state;
    dispatch(
      navigatePush(SEARCH_SURVEY_CONTACTS_FILTER_SCREEN, {
        survey,
        onFilter: this.handleChangeFilter,
        filters,
      }),
    );
  };

  // @ts-ignore
  handleChangeFilter = filters => {
    this.setState({ filters });
    this.handleRefreshSearchList();
  };

  // @ts-ignore
  handleSearch = async text => {
    await this.setState({ pagination: { page: 0, hasMore: true } });
    return this.handleLoadMore(text);
  };

  handleRefreshSearchList = () =>
    // @ts-ignore
    this.searchListSearch && this.searchListSearch();

  // @ts-ignore
  handleSelect = person => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(
      navToPersonScreen(person, organization, {
        onAssign: this.handleRefreshSearchList,
        trackingObj: buildTrackingObj(
          'communities : surveys : respondants : contact',
          'communities',
          'surveys',
          'respondants',
          'contact',
        ),
      }),
    );
  };

  // @ts-ignore
  handleLoadMore = async text => {
    // @ts-ignore
    const { dispatch, organization, survey } = this.props;
    const { filters, pagination } = this.state;
    const searchFilters = {
      ...filters,
      survey: { id: survey.id },
    };

    const results = await dispatch(
      // @ts-ignore
      getOrganizationContacts(organization.id, text, pagination, searchFilters),
    );

    const { meta, response } = results;

    this.setState({ pagination: buildUpdatedPagination(meta, pagination) });

    // Get the results from the search endpoint
    return response;
  };

  // @ts-ignore
  setSearch = search => (this.searchListSearch = search);

  // @ts-ignore
  renderItem = ({ item }) => {
    // @ts-ignore
    const { organization } = this.props;

    return (
      <PersonListItem
        organization={organization}
        person={item}
        onSelect={this.handleSelect}
      />
    );
  };

  render() {
    // @ts-ignore
    const { t, organization, survey } = this.props;
    const { filters, defaultResults } = this.state;
    const orgName = organization ? organization.name : undefined;
    return (
      <View style={styles.container}>
        <Header
          left={<BackButton />}
          title={orgName}
          right={<ShareSurveyMenu survey={survey} header={true} />}
        />
        <SearchList
          // @ts-ignore
          setSearch={this.setSearch}
          defaultData={defaultResults}
          onFilterPress={this.handleFilterPress}
          listProps={{
            renderItem: this.renderItem,
          }}
          onSearch={this.handleSearch}
          onRemoveFilter={this.handleRemoveFilter}
          onLoadMore={this.handleLoadMore}
          filters={filters}
          placeholder={t('searchPlaceholder')}
        />
      </View>
    );
  }
}

// @ts-ignore
SurveyContacts.propTypes = {
  organization: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyContacts);
export const GROUPS_SURVEY_CONTACTS = 'nav/GROUPS_SURVEY_CONTACTS';
