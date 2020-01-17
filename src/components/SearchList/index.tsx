import React, { Component } from 'react';
import { ScrollView, View, FlatList } from 'react-native';
import debounce from 'lodash.debounce';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { IconButton, Input, Text } from '../../components/common';
import LoadingWheel from '../../components/LoadingWheel';
import theme from '../../theme';

import styles from './styles';

// @ts-ignore
@withTranslation('search')
class SearchList extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      results: [],
      isSearching: false,
      listHasScrolled: false,
    };

    // @ts-ignore
    this.handleSearchDebounced = debounce(this.handleSearch, 300);
  }

  componentDidMount() {
    // @ts-ignore
    const { setSearch } = this.props;
    // Share search instance with parent
    setSearch && setSearch(this.search);
  }

  // Kick off search from an outer component using refs
  search = () => {
    // @ts-ignore
    this.handleSearch(this.state.text);
  };

  handleFilter = () => {
    // @ts-ignore
    this.props.onFilterPress();
  };

  // @ts-ignore
  handleTextChange = t => {
    this.setState({ text: t, isSearching: true });
    // @ts-ignore
    this.handleSearchDebounced(t);
  };

  // @ts-ignore
  handleSearch = async text => {
    // @ts-ignore
    if (!this.state.isSearching) {
      this.setState({ isSearching: true });
    }

    try {
      // @ts-ignore
      const results = await this.props.onSearch(text);
      this.setState({ isSearching: false, results: results || [] });
    } catch (err) {
      this.setState({ isSearching: false });
    }
  };

  handleOnEndReached = async () => {
    // @ts-ignore
    const { listHasScrolled, text, isSearching, results } = this.state;
    if (!listHasScrolled || isSearching) {
      return;
    }

    this.setState({ isSearching: true });

    // @ts-ignore
    const newResults = await this.props.onLoadMore(text);

    this.setState({
      listHasScrolled: false,
      isSearching: false,
      results: [...results, ...newResults],
    });
  };

  handleScrollEndDrag = () => {
    // @ts-ignore
    if (!this.state.listHasScrolled) {
      this.setState({ listHasScrolled: true });
    }
  };

  clearSearch = () => {
    this.setState({ text: '', results: [], isSearching: false }, () =>
      // @ts-ignore
      this.handleSearchDebounced(),
    );
  };

  // @ts-ignore
  removeFilter = async key => {
    // @ts-ignore
    await this.props.onRemoveFilter(key);
    // @ts-ignore
    this.handleSearchDebounced(this.state.text);
  };

  // @ts-ignore
  ref = c => (this.searchInput = c);

  renderCenter() {
    // @ts-ignore
    const { t, placeholder } = this.props;
    // @ts-ignore
    const { text } = this.state;
    return (
      <View
        // @ts-ignore
        flex={1}
        flexDirection="row"
        alignItems="center"
        style={styles.inputWrap}
        alignSelf="stretch"
      >
        <Input
          ref={this.ref}
          onChangeText={this.handleTextChange}
          value={text}
          style={styles.input}
          autoFocus={false}
          selectionColor={theme.grey2}
          returnKeyType="done"
          blurOnSubmit={true}
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
      </View>
    );
  }

  renderFilters() {
    // @ts-ignore
    const { filters } = this.props;
    const keys = Object.keys(filters).filter(k => filters[k]);
    if (keys.length === 0) {
      return null;
    }

    return (
      <ScrollView horizontal={true} style={styles.activeFilterWrap}>
        {keys.map(k => (
          <View
            key={filters[k].id}
            // @ts-ignore
            flexDirection="row"
            alignItems="center"
            style={styles.activeFilterRow}
          >
            <Text style={styles.activeFilterText}>{filters[k].text}</Text>
            <IconButton
              style={styles.activeFilterIcon}
              name="cancelIcon"
              type="MissionHub"
              pressProps={[k]}
              onPress={this.removeFilter}
            />
          </View>
        ))}
      </ScrollView>
    );
  }

  // @ts-ignore
  keyExtractor = i => i.unique_key || i.id;

  renderHeader() {
    return (
      <View style={styles.searchWrap}>
        <View
          // @ts-ignore
          flexDirection="row"
          alignItems="center"
          style={styles.searchFilterWrap}
        >
          {this.renderCenter()}
          <IconButton
            name="filterIcon"
            type="MissionHub"
            onPress={this.handleFilter}
            style={styles.filterButton}
          />
        </View>
        {this.renderFilters()}
      </View>
    );
  }

  renderEmpty() {
    // @ts-ignore
    return this.state.isSearching ? null : (
      // @ts-ignore
      <View alignItems="center" flex={1} style={styles.emptyWrap}>
        // @ts-ignore
        <Text style={styles.nullText}>{this.props.t('noResults')}</Text>
      </View>
    );
  }

  renderContent() {
    // @ts-ignore
    const { listProps, defaultData = [] } = this.props;
    // @ts-ignore
    const { results } = this.state;
    const resultsLength = results.length;

    return (
      <FlatList
        style={styles.list}
        data={resultsLength === 0 ? defaultData : results}
        keyExtractor={this.keyExtractor}
        onEndReached={this.handleOnEndReached}
        onEndReachedThreshold={0.2}
        onScrollEndDrag={this.handleScrollEndDrag}
        ListFooterComponent={this.renderListFooter()}
        keyboardShouldPersistTaps="handled"
        {...listProps}
      />
    );
  }

  renderListFooter() {
    // @ts-ignore
    return this.state.isSearching ? (
      <LoadingWheel style={styles.loadingIndicator} />
    ) : null;
  }

  render() {
    // @ts-ignore
    const { defaultData = [] } = this.props;
    // @ts-ignore
    const { results, isSearching } = this.state;
    const resultsLength = results.length;

    return (
      <View style={styles.pageContainer}>
        {this.renderHeader()}
        {!isSearching && resultsLength === 0 && defaultData.length === 0
          ? this.renderEmpty()
          : this.renderContent()}
      </View>
    );
  }
}

// @ts-ignore
SearchList.propTypes = {
  onFilterPress: PropTypes.func.isRequired,
  listProps: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchList;
