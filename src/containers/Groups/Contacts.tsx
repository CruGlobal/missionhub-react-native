import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
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

// @ts-ignore
@withTranslation('groupsContacts')
class Contacts extends Component {
  state = {
    pagination: {
      page: 0,
      hasMore: true,
    },
    filters: {
      // Default filters
      // @ts-ignore
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

  // @ts-ignore
  handleRemoveFilter = key => {
    // @ts-ignore
    return searchRemoveFilter(this, key, ['unassigned', 'time']);
  };

  handleFilterPress = () => {
    // @ts-ignore
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
  handleLoadMore = async text => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    const { filters, pagination } = this.state;

    const result = await dispatch(
      // @ts-ignore
      getOrganizationContacts(organization.id, text, pagination, filters),
    );

    const { meta, response } = result;

    this.setState({ pagination: buildUpdatedPagination(meta, pagination) });

    return response;
  };

  // @ts-ignore
  handleSelect = person => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(
      navToPersonScreen(person, organization, {
        onAssign: this.handleRefreshSearchList,
      }),
    );
  };

  // @ts-ignore
  setSearch = search => (this.searchListSearch = search);

  // @ts-ignore
  renderItem = ({ item }) => (
    <PersonListItem
      // @ts-ignore
      organization={this.props.organization}
      person={item}
      onSelect={this.handleSelect}
    />
  );

  render() {
    // @ts-ignore
    const { t } = this.props;
    const { filters, defaultResults } = this.state;
    return (
      <View style={styles.pageContainer}>
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
Contacts.propTypes = {
  organization: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = ({ organizations }, { orgId }) => ({
  organization: organizationSelector({ organizations }, { orgId }),
});

export default connect(mapStateToProps)(Contacts);
