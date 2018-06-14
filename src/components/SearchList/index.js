import React, { Component } from 'react';
import { ScrollView, View, Image, FlatList } from 'react-native';
import debounce from 'lodash/debounce';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import SEARCH_NULL from '../../../assets/images/searchNull.png';
import { Flex, IconButton, Input, Text } from '../../components/common';
import theme from '../../theme';

import styles from './styles';

@translate('search', { withRef: true, wait: true })
class SearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      results: [],
      isSearching: false,
    };

    this.handleSearchDebounced = debounce(this.handleSearch, 300);
  }

  // Kick off search from an outer component using refs
  search = () => {
    this.handleSearch(this.state.text);
  };

  handleFilter = () => {
    this.props.onFilterPress();
  };

  handleTextChange = t => {
    this.setState({ text: t, isSearching: true });
    this.handleSearchDebounced(t);
  };

  handleSearch = async text => {
    if (!this.state.isSearching) {
      this.setState({ isSearching: true });
    }

    try {
      const results = await this.props.onSearch(text);
      this.setState({ isSearching: false, results: results || [] });
    } catch (err) {
      this.setState({ isSearching: false });
    }
  };

  clearSearch = () => {
    this.setState({ text: '', results: [], isSearching: false }, () =>
      this.handleSearchDebounced(),
    );
  };

  async removeFilter(key) {
    await this.props.onRemoveFilter(key);
    this.handleSearchDebounced(this.state.text);
  }

  renderCenter() {
    const { t, placeholder } = this.props;
    const { text } = this.state;
    return (
      <Flex
        value={1}
        direction="row"
        align="center"
        style={styles.inputWrap}
        self="stretch"
      >
        <Input
          ref={c => (this.searchInput = c)}
          onChangeText={this.handleTextChange}
          value={text}
          style={styles.input}
          autoFocus={false}
          selectionColor={theme.grey2}
          returnKeyType="done"
          blurOnSubmit={true}
          style={styles.input}
          placeholder={placeholder || t('inputPlaceholder')}
          placeholderTextColor={theme.grey1}
        />
        {text ? (
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
    const { filters } = this.props;
    const keys = Object.keys(filters).filter(k => filters[k]);
    if (keys.length === 0) return null;

    return (
      <ScrollView horizontal={true} style={styles.activeFilterWrap}>
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
              name="cancelIcon"
              type="MissionHub"
              onPress={() => this.removeFilter(k)}
            />
          </Flex>
        ))}
      </ScrollView>
    );
  }

  renderContent() {
    const { t, listProps, defaultData = [] } = this.props;
    const { results, text, isSearching } = this.state;
    const resultsLength = results.length;
    if (isSearching && resultsLength === 0) {
      return (
        <Flex align="center" value={1} style={styles.emptyWrap}>
          <Text style={styles.nullText}>{t('loading')}</Text>
        </Flex>
      );
    }
    if (text && resultsLength === 0) {
      return (
        <Flex align="center" value={1} style={styles.emptyWrap}>
          <Text style={styles.nullText}>{t('noResults')}</Text>
        </Flex>
      );
    }
    if (defaultData.length === 0 && resultsLength === 0) {
      return (
        <Flex align="center" justify="center" value={1} style={styles.nullWrap}>
          <Image source={SEARCH_NULL} style={styles.nullImage} />
          <Text type="header" style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>{t('nullDescription')}</Text>
        </Flex>
      );
    }
    return (
      <FlatList
        style={styles.list}
        data={resultsLength === 0 ? defaultData : results}
        keyExtractor={i => i.unique_key || i.id}
        {...listProps}
      />
    );
  }

  render() {
    return (
      <View style={styles.pageContainer}>
        <Flex style={styles.searchWrap}>
          <Flex direction="row" align="center" style={styles.searchFilterWrap}>
            {this.renderCenter()}
            <IconButton
              name="filterIcon"
              type="MissionHub"
              onPress={this.handleFilter}
              style={styles.filterButton}
            />
          </Flex>
          {this.renderFilters()}
        </Flex>
        {this.renderContent()}
      </View>
    );
  }
}

SearchList.propTypes = {
  onFilterPress: PropTypes.func.isRequired,
  listProps: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchList;
