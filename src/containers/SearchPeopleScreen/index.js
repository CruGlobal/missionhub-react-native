import React, { Component } from 'react';
import { View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { translate } from 'react-i18next';

import SEARCH_NULL from '../../../assets/images/searchNull.png';
import { navigateBack, navigatePush } from '../../actions/navigation';
import { searchPeople } from '../../actions/people';
import styles from './styles';
import { Flex, IconButton, Input, Text } from '../../components/common';
import Header from '../Header';
import SearchPeopleItem from '../../components/SearchPeopleItem';
import theme from '../../theme';
import { CONTACT_SCREEN } from '../ContactScreen';

@translate('search')
export class SearchPeopleScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      results: [],
      filters: {},
      isSearching: false,
    };

    this.handleSelectPerson = this.handleSelectPerson.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleSearch = debounce(this.handleSearch.bind(this), 300);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  handleSelectPerson(person) {
    this.props.dispatch(navigatePush(CONTACT_SCREEN, { person }));
  }

  handleFilter() {
    this.props.dispatch(navigatePush('SearchPeopleFilter', {
      onFilter: this.handleChangeFilter,
      filters: this.state.filters,
    }));
  }

  handleChangeFilter(filters) {
    this.setState({ filters });
  }

  handleTextChange(t) {
    this.setState({ text: t, isSearching: true });
    this.handleSearch(t);
  }

  handleSearch(text) {
    if (!text) return this.clearSearch();
    if (!this.state.isSearching) {
      this.setState({ isSearching: true });
    }

    this.props.dispatch(searchPeople(text, this.state.filters)).then((results) => {
      const people = results.findAll('person') || [];
      this.setState({ isSearching: false, results: people });
    }).catch((err) => {
      this.setState({ isSearching: false });
      LOG('error getting search results', err);
    });
  }

  clearSearch() {
    this.setState({ text: '', results: [], isSearching: false });
  }

  removeFilter(key) {
    let filters = { ...this.state.filters };
    delete filters[key];
    this.setState({ filters });
    this.handleSearch(this.state.text);
  }

  renderCenter() {
    const { t } = this.props;
    const { text } = this.state;
    return (
      <Flex direction="row" align="center" style={styles.searchWrap} self="stretch">
        <Input
          ref={(c) => this.searchInput = c}
          onChangeText={this.handleTextChange}
          value={text}
          style={styles.input}
          autoFocus={true}
          selectionColor="white"
          returnKeyType="done"
          blurOnSubmit={true}
          style={styles.input}
          placeholder={t('inputPlaceholder')}
          placeholderTextColor={theme.white}
        />
        {
          this.state.text ? (
            <IconButton
              name="cancelIcon"
              type="MissionHub"
              onPress={this.clearSearch}
              style={styles.clearIcon} />
          ) : null
        }
      </Flex>
    );
  }

  renderFilters() {
    const { filters } = this.state;
    const keys = Object.keys(filters).filter((k) => filters[k]);
    if (keys.length === 0) return null;

    return (
      <Flex direction="column" style={styles.activeFilterWrap}>
        {
          keys.map((k) => (
            <Flex key={filters[k].id} direction="row" align="center" style={styles.activeFilterRow}>
              <Text style={styles.activeFilterText}>
                {filters[k].text}
              </Text>
              <IconButton
                style={styles.activeFilterIcon}
                name="deleteIcon"
                type="MissionHub"
                onPress={() => this.removeFilter(k)}
              />
            </Flex>
          ))
        }
      </Flex>
    );
  }

  renderContent() {
    const { t } = this.props;
    const { results, text, isSearching } = this.state;
    if (isSearching && results.length === 0) {
      return (
        <Flex align="center" value={1} style={styles.emptyWrap}>
          <Text style={styles.nullText}>
            {t('loading')}
          </Text>
        </Flex>
      );
    }
    if (text && results.length === 0) {
      return (
        <Flex align="center" value={1} style={styles.emptyWrap}>
          <Text style={styles.nullText}>
            {t('noResults')}
          </Text>
        </Flex>
      );
    }
    if (results.length === 0) {
      return (
        <Flex align="center" justify="center" value={1} style={styles.nullWrap}>
          <Image source={SEARCH_NULL} style={styles.nullImage} />
          <Text type="header" style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>
            {t('nullDescription')}
          </Text>
        </Flex>
      );
    }
    return (
      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <SearchPeopleItem
            onSelect={this.handleSelectPerson}
            person={item} />
        )}
      />
    );
  }

  render() {
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton
              name="backIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigateBack())} />
          }
          right={
            <IconButton
              name="filterIcon"
              type="MissionHub"
              onPress={this.handleFilter} />
          }
          center={this.renderCenter()}
        />
        {this.renderFilters()}
        {this.renderContent()}
      </View>
    );
  }
}

export default connect()(SearchPeopleScreen);
