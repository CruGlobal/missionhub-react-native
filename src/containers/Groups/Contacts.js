import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button, Flex, Text } from '../../components/common';
import SearchList from '../../components/SearchList';

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
    LOG('press filter button');
    // TESTING
    this.setState({
      filters: {
        test: { id: 'filter1', text: 'Last 30 days' },
        test2: { id: 'filter2', text: 'Last 7 days' },
        test3: { id: 'filter3', text: 'Filter 3' },
        test4: { id: 'filter4', text: 'Filter 4' },
        test5: { id: 'filter5', text: 'Filter 5' },
      },
    });
  };

  handleSearch = text => {
    LOG('searching', text);
    return Promise.resolve([
      { id: 1, text: 'number 1' },
      { id: 2, text: 'number 2' },
      { id: 3, text: 'number 3' },
      { id: 4, text: 'number 4' },
    ]);
  };

  render() {
    const { t } = this.props;
    const { filters } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <SearchList
          onFilterPress={this.handleFilterPress}
          listProps={{
            renderItem: ({ item }) => <Text>{item.text}</Text>,
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
