import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { Flex } from '../../components/common';
import SearchList from '../../components/SearchList';
import PersonListItem from '../../components/PersonListItem';
import {
  searchRemoveFilter,
  unassignedFilter,
  thirtyDaysFilter,
} from '../../utils/filters';
import { buildTrackingObj } from '../../utils/common';
import Header from '../Header';
import BackButton from '../BackButton';
import { navToPersonScreen } from '../../actions/person';
import { buildUpdatedPagination } from '../../utils/pagination';
import ShareSurveyMenu from '../../components/ShareSurveyMenu';
import { getOrganizationContacts } from '../../actions/organizations';

import { SEARCH_SURVEY_CONTACTS_FILTER_SCREEN } from './SurveyContactsFilter';

@translate('groupsSurveyContacts')
class SurveyContacts extends Component {
  constructor(props) {
    super(props);
    const { t } = props;

    this.state = {
      pagination: {
        page: 0,
        hasMore: true,
      },
      //Default filters
      filters: {
        unassigned: unassignedFilter(t, true),
        time: thirtyDaysFilter(t),
      },
      defaultResults: [],
    };
  }

  componentDidMount() {
    // Use the default filters to load in these people
    this.loadContactsWithFilters();
  }

  loadContactsWithFilters = async () => {
    const contacts = await this.handleSearch('');
    this.setState({ defaultResults: contacts });
  };

  handleRemoveFilter = key => {
    return searchRemoveFilter(this, key, ['unassigned', 'time']);
  };

  handleFilterPress = () => {
    const { dispatch, survey, organization } = this.props;
    const { filters } = this.state;
    dispatch(
      navigatePush(SEARCH_SURVEY_CONTACTS_FILTER_SCREEN, {
        survey,
        organization,
        onFilter: this.handleChangeFilter,
        filters,
      }),
    );
  };

  handleChangeFilter = filters => {
    this.setState({ filters });
    this.handleRefreshSearchList();
  };

  handleSearch = async text => {
    const pagination = {
      page: 0,
      hasMore: true,
    };

    await this.setState({ pagination });

    return await this.handleLoadMore(text);
  };

  handleRefreshSearchList = () => {
    if (this.searchList && this.searchList.getWrappedInstance) {
      this.searchList.getWrappedInstance().search();
    }
  };

  handleSelect = person => {
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

  handleLoadMore = async text => {
    const { dispatch, organization, survey } = this.props;
    const { filters, pagination } = this.state;
    const searchFilters = {
      ...filters,
      survey: { id: survey.id },
    };

    const results = await dispatch(
      getOrganizationContacts(organization.id, text, pagination, searchFilters),
    );

    const { meta, response } = results;

    this.setState({ pagination: buildUpdatedPagination(meta, pagination) });

    // Get the results from the search endpoint
    return response;
  };

  ref = c => (this.searchList = c);

  renderItem = ({ item }) => {
    const { organization } = this.props;

    return (
      <PersonListItem
        organization={organization}
        contact={item}
        onSelect={this.handleSelect}
      />
    );
  };

  render() {
    const { t, organization, survey } = this.props;
    const { filters, defaultResults } = this.state;
    const orgName = organization ? organization.name : undefined;
    return (
      <Flex value={1}>
        <Header
          left={<BackButton />}
          title={orgName}
          right={<ShareSurveyMenu survey={survey} header={true} />}
        />
        <SearchList
          ref={this.ref}
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
      </Flex>
    );
  }
}

SurveyContacts.propTypes = {
  organization: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyContacts);
export const GROUPS_SURVEY_CONTACTS = 'nav/GROUPS_SURVEY_CONTACTS';
