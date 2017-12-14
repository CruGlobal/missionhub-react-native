import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import SEARCH_NULL from '../../../assets/images/searchNull.png';
import { navigateBack, navigatePush } from '../../actions/navigation';
import styles from './styles';
import { Flex, IconButton, Input, Text } from '../../components/common';
import Header from '../Header';
import theme from '../../theme';

export class SearchPeopleScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      results: [],
      filters: {},
    };

    this.handleFilter = this.handleFilter.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleSearch = debounce(this.handleSearch.bind(this), 300);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  handleFilter() {
    this.props.dispatch(navigatePush('SearchPeopleFilter', { onFilter: this.handleChangeFilter }));
  }

  handleChangeFilter(filters) {
    this.setState({ filters });
  }

  handleTextChange(t) {
    this.setState({ text: t });
    this.handleSearch(t);
  }

  handleSearch(text) {
    if (!text) return;
    LOG('handling search', text);
  }

  clearSearch() {
    this.setState({ text: '' });
  }

  renderCenter() {
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
          placeholder="Search"
          placeholderTextColor={theme.white}
        />
        {
          this.state.text ? (
            <IconButton
              name="plusIcon"
              type="MissionHub"
              onPress={this.clearSearch}
              style={styles.clearIcon} />
          ) : null
        }
      </Flex>
    );
  }

  renderContent() {
    const { results } = this.state;
    if (results.length === 0) {
      return (
        <Flex align="center" justify="center" value={1} style={styles.nullWrap}>
          <Image source={SEARCH_NULL} style={styles.nullImage} />
          <Text type="header" style={styles.nullHeader}>
            Search
          </Text>
          <Text style={styles.nullText}>
            Search results will appear here.
          </Text>
        </Flex>
      );
    }
    return (
      <Flex />
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
              name="journeyIcon"
              type="MissionHub"
              onPress={this.handleFilter} />
          }
          center={this.renderCenter()}
        />
        {this.renderContent()}
      </View>
    );
  }
}

export default connect()(SearchPeopleScreen);
