import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import {
  getOrganizationContacts,
  reloadOrganizationContacts,
} from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import { Flex } from '../../components/common';
import SearchList from '../../components/SearchList';
import ContactItem from '../../components/ContactItem';
import { searchRemoveFilter } from '../../utils/filters';
import { organizationSelector } from '../../selectors/organizations';
import { contactsInOrgSelector } from '../../selectors/people';

import { SEARCH_CONTACTS_FILTER_SCREEN } from './ContactsFilter';

@translate('groupsContacts')
class Contacts extends Component {
  constructor(props) {
    super(props);
    const { t } = props;

    this.state = {
      filters: {
        // Default filters
        unassigned: {
          id: 'unassigned',
          selected: true,
          text: t('searchFilter:unassigned'),
        },
        // TODO: temporarily remove this until the API supports it
        // time: { id: 'time30', text: t('searchFilter:time30') },
      },
      defaultResults: [],
    };
  }

  componentDidMount() {
    // TODO: Only do this when this tab is focused to improve performance
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
    this.setState({ filters }, () => {
      // Run the search every time a filter option changes
      if (this.searchList && this.searchList.getWrappedInstance) {
        this.searchList.getWrappedInstance().search();
      }
    });
  };

  handleSearch = async text => {
    const { dispatch, organization } = this.props;
    const { filters } = this.state;
    return await dispatch(
      reloadOrganizationContacts(organization.id, text, filters),
    );
  };

  handleLoadMore = async text => {
    const { dispatch, organization } = this.props;
    const { filters } = this.state;
    return await dispatch(
      getOrganizationContacts(organization.id, text, filters),
    );
  };

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(navToPersonScreen(person, organization));
  };

  listRef = c => (this.searchList = c);

  renderItem = ({ item }) => (
    <ContactItem
      organization={this.props.organization}
      contact={item}
      onSelect={this.handleSelect}
    />
  );

  render() {
    const { t, contactList } = this.props;
    const { filters, defaultResults } = this.state;
    return (
      <Flex value={1}>
        <SearchList
          ref={this.listRef}
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
          results={contactList}
        />
      </Flex>
    );
  }
}

Contacts.propTypes = {
  organization: PropTypes.object.isRequired,
  contactList: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
};

const mapStateToProps = ({ organizations, contacts }, { orgId }) => {
  const organization = organizationSelector({ organizations }, { orgId });
  const contactList = contactsInOrgSelector({ contacts }, { organization });
  const pagination = organization.contactPagination || {
    page: 0,
    hasNextPage: true,
  };

  return {
    organization,
    contactList,
    pagination,
  };
};

export default connect(mapStateToProps)(Contacts);
