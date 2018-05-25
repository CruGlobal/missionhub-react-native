import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Separator } from '../../components/common';
import SearchList from '../../components/SearchList';
import ContactItem from '../../components/ContactItem';

@connect()
@translate('groupsContacts')
export default class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {},
    };

    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  async handleRemoveFilter(key) {
    const newFilters = { ...this.state.filters };
    delete newFilters[key];
    return await new Promise(resolve =>
      this.setState({ filters: newFilters }, () => {
        resolve();
      }),
    );
  }

  handleFilterPress = () => {
    // TODO: Navigate to the filters page, then change state when something is selected
    // TESTING
    this.setState({
      filters: {
        filter1: { id: 'filter1', text: 'Last 30 days' },
        filter2: { id: 'filter2', text: 'Last 7 days' },
        filter3: { id: 'filter3', text: 'Filter 3' },
        filter4: { id: 'filter4', text: 'Filter 4' },
        filter5: { id: 'filter5', text: 'Filter 5' },
      },
    });
  };

  handleSearch = text => {
    // TODO: Implement this
    return Promise.resolve([
      { id: '1', full_name: 'full name 1', isAssigned: false },
      { id: '2', full_name: 'full name 2', isAssigned: false },
      { id: '3', full_name: 'full name 3', isAssigned: true },
      { id: '4', full_name: 'full name 4', isAssigned: false },
    ]);
  };

  handleSelect = item => {
    LOG('selected item', item);
  };

  render() {
    const { t } = this.props;
    const { filters } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <SearchList
          onFilterPress={this.handleFilterPress}
          listProps={{
            renderItem: ({ item }) => (
              <ContactItem contact={item} onSelect={this.handleSelect} />
            ),
            ItemSeparatorComponent: (sectionID, rowID) => (
              <Separator key={rowID} />
            ),
          }}
          onSearch={this.handleSearch}
          onRemoveFilter={this.handleRemoveFilter}
          filters={filters}
          placeholder={t('searchPlaceholder')}
        />
      </View>
    );
  }
}
