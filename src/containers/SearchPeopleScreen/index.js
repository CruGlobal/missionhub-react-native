import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { translate } from 'react-i18next';

import NullStateComponent from '../../components/NullStateComponent';
import SEARCH_NULL from '../../../assets/images/searchNull.png';
import { navigatePush } from '../../actions/navigation';
import { searchPeople } from '../../actions/people';
import { Flex, IconButton, Input, Text } from '../../components/common';
import Header from '../Header';
import SearchPeopleItem from '../../components/SearchPeopleItem';
import theme from '../../theme';
import { SEARCH_FILTER_SCREEN } from '../SearchPeopleFilterScreen';
import BackButton from '../BackButton';
import { navToPersonScreen } from '../../actions/person';

import styles from './styles';

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

  handleSelectPerson(person, organization) {
    this.props.dispatch(navToPersonScreen(person, organization));
  }

  handleFilter() {
    this.props.dispatch(
      navigatePush(SEARCH_FILTER_SCREEN, {
        onFilter: this.handleChangeFilter,
        filters: this.state.filters,
      }),
    );
  }

  handleChangeFilter(filters) {
    this.setState({ filters });
  }

  handleTextChange(t) {
    this.setState({ text: t, isSearching: true });
    this.handleSearch(t);
  }

  getPeopleByOrg(results) {
    let people = results.findAll('person') || [];
    let orgPeople = [];
    people.forEach(p => {
      if (p && p.organizational_permissions) {
        p.organizational_permissions.forEach(o => {
          if (o.organization && o.organization.id) {
            orgPeople.push({
              ...p,
              unique_key: `${o.organization.id}_${p.id}`,
              organization: o.organization,
            });
          } else {
            orgPeople.push(p);
          }
        });
      } else {
        orgPeople.push(p);
      }
    });
    return orgPeople;
  }

  handleSearch(text) {
    if (!text) {
      return this.clearSearch();
    }
    if (!this.state.isSearching) {
      this.setState({ isSearching: true });
    }

    this.props
      .dispatch(searchPeople(text, this.state.filters))
      .then(results => {
        const people = this.getPeopleByOrg(results);
        this.setState({ isSearching: false, results: people });
      })
      .catch(err => {
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

  centerRef = c => (this.searchInput = c);

  renderCenter() {
    const { t } = this.props;
    const { text } = this.state;
    return (
      <Flex
        direction="row"
        align="center"
        style={styles.searchWrap}
        self="stretch"
      >
        <Input
          ref={this.centerRef}
          onChangeText={this.handleTextChange}
          value={text}
          style={styles.input}
          autoFocus={true}
          selectionColor="white"
          returnKeyType="done"
          blurOnSubmit={true}
          placeholder={t('inputPlaceholder')}
          placeholderTextColor={theme.white}
        />
        {this.state.text ? (
          <IconButton
            name="cancelIcon"
            type="MissionHub"
            onPress={this.clearSearch}
            style={styles.clearIcon}
          />
        ) : null}
      </Flex>
    );
  }

  renderFilters() {
    const { filters } = this.state;
    const keys = Object.keys(filters).filter(k => filters[k]);
    if (keys.length === 0) {
      return null;
    }

    return (
      <Flex direction="column" style={styles.activeFilterWrap}>
        {keys.map(k => (
          <Flex
            key={filters[k].id}
            direction="row"
            align="center"
            style={styles.activeFilterRow}
          >
            <Text style={styles.activeFilterText}>{filters[k].text}</Text>
            <IconButton
              style={styles.activeFilterIcon}
              name="deleteIcon"
              type="MissionHub"
              onPress={() => this.removeFilter(k)}
            />
          </Flex>
        ))}
      </Flex>
    );
  }

  listKeyExtractor = i => i.unique_key || i.id;

  renderItem = ({ item }) => (
    <SearchPeopleItem onSelect={this.handleSelectPerson} person={item} />
  );

  renderContent() {
    const { t } = this.props;
    const { results, text, isSearching } = this.state;
    if (isSearching && results.length === 0) {
      return (
        <Flex align="center" value={1} style={styles.emptyWrap}>
          <Text style={styles.nullText}>{t('loading')}</Text>
        </Flex>
      );
    }
    if (text && results.length === 0) {
      return (
        <Flex align="center" value={1} style={styles.emptyWrap}>
          <Text style={styles.nullText}>{t('noResults')}</Text>
        </Flex>
      );
    }
    if (results.length === 0) {
      return (
        <NullStateComponent
          imageSource={SEARCH_NULL}
          headerText={t('nullHeader')}
          descriptionText={t('nullDescription')}
        />
      );
    }
    return (
      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={this.listKeyExtractor}
        renderItem={this.renderItem}
      />
    );
  }

  render() {
    return (
      <View style={styles.pageContainer}>
        <Header
          left={<BackButton />}
          right={
            <IconButton
              name="filterIcon"
              type="MissionHub"
              onPress={this.handleFilter}
            />
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
export const SEARCH_SCREEN = 'nav/SEARCH';
