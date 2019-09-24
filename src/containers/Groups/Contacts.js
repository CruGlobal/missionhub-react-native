import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { getOrganizationContacts } from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import SearchList from '../../components/SearchList';
import PersonListItem from '../../components/PersonListItem';
import { organizationSelector } from '../../selectors/organizations';
import { searchRemoveFilter, unassignedFilter } from '../../utils/filters';
import { buildUpdatedPagination } from '../../utils/pagination';

import { SEARCH_CONTACTS_FILTER_SCREEN } from './ContactsFilter';
import styles from './styles';

@withTranslation('groupsContacts')
class Contacts extends Component {
  state = {
    pagination: {
      page: 0,
      hasMore: true,
    },
    filters: {
      // Default filters
      unassigned: unassignedFilter(this.props.t, true),
      // TODO: temporarily remove this until the API supports it
      // time: thirtyDaysFilter(t),
    },
    defaultResults: [],
  };

  componentDidMount() {
    // TODO: Only do this when this tab is focused to improve performance
    // Use the default filters to load in these people
    this.loadContactsWithFilters();
  }

  loadContactsWithFilters = async () => {
    const contacts = await this.handleLoadMore('');
    this.setState({ defaultResults: contacts });
  };

  handleRemoveFilter = key => {
    return searchRemoveFilter(this, key, ['unassigned', 'time']);
  };

  handleFilterPress = () => {
    const { dispatch, organization } = this.props;
    const { filters } = this.state;
    dispatch(
      navigatePush(SEARCH_CONTACTS_FILTER_SCREEN, {
        onFilter: this.handleChangeFilter,
        organization,
        filters,
      }),
    );
  };

  handleChangeFilter = filters => {
    this.setState({ filters });
    this.handleRefreshSearchList();
  };

  handleSearch = async text => {
    await this.setState({ pagination: { page: 0, hasMore: true } });
    return this.handleLoadMore(text);
  };

  handleRefreshSearchList = () =>
    this.searchListSearch && this.searchListSearch();

  handleLoadMore = async text => {
    const { dispatch, organization } = this.props;
    const { filters, pagination } = this.state;

    const result = await dispatch(
      getOrganizationContacts(organization.id, text, pagination, filters),
    );

    const { meta, response } = result;

    this.setState({ pagination: buildUpdatedPagination(meta, pagination) });

    return response;
  };

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(
      navToPersonScreen(person, organization, {
        onAssign: this.handleRefreshSearchList,
      }),
    );
  };

  setSearch = search => (this.searchListSearch = search);

  renderItem = ({ item }) => (
    <PersonListItem
      organization={this.props.organization}
      person={item}
      onSelect={this.handleSelect}
    />
  );

  render() {
    const { t } = this.props;
    const { filters, defaultResults } = this.state;
    return (
      <View style={styles.pageContainer}>
        <SearchList
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

Contacts.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ organizations }, { orgId }) => ({
  organization: organizationSelector({ organizations }, { orgId }),
});

export default connect(mapStateToProps)(Contacts);
