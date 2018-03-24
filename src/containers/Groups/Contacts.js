import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { searchPeople } from '../../actions/people';
import { navToPersonScreen } from '../../actions/person';
import { Flex } from '../../components/common';
import SearchList from '../../components/SearchList';
import ContactItem from '../../components/ContactItem';
import { searchRemoveFilter } from '../../utils/common';

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
        time: { id: 'time30', text: t('searchFilter:time30') },
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
    const { dispatch } = this.props;
    const { filters } = this.state;
    dispatch(
      navigatePush(SEARCH_CONTACTS_FILTER_SCREEN, {
        onFilter: this.handleChangeFilter,
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
    const searchFilters = {
      ...filters,
      ministry: { id: organization.id },
    };

    const results = await dispatch(searchPeople(text, searchFilters));
    // Get the results from the search endpoint
    return results.findAll('person') || [];
  };

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    const isMember = false;
    const isAssignedToMe = true;
    dispatch(navToPersonScreen(person, organization, isMember, isAssignedToMe));
  };

  listRef = c => (this.searchList = c);

  render() {
    const { t, organization } = this.props;
    const { filters, defaultResults } = this.state;
    return (
      <Flex value={1}>
        <SearchList
          ref={this.listRef}
          defaultData={defaultResults}
          onFilterPress={this.handleFilterPress}
          listProps={{
            renderItem: ({ item }) => (
              <ContactItem
                organization={organization}
                contact={item}
                onSelect={this.handleSelect}
              />
            ),
          }}
          onSearch={this.handleSearch}
          onRemoveFilter={this.handleRemoveFilter}
          filters={filters}
          placeholder={t('searchPlaceholder')}
        />
      </Flex>
    );
  }
}

Contacts.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default connect()(Contacts);
