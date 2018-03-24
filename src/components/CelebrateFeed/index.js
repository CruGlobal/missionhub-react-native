import React, { Component } from 'react';
import { SectionList } from 'react-native';

import { DateComponent, Flex } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';

import styles from './styles';

export default class CelebrateFeed extends Component {
  constructor(props) {
    super(props);
    // isListScrolled works around a known issue with SectionList in RN. see commit msg for details.
    this.state = { ...this.state, isListScrolled: false };
  }

  renderSectionHeader = ({ section: { date } }) => {
    const { title, header } = styles;

    return (
      <Flex style={header} align="center">
        <DateComponent date={date} format={'relative'} style={title} />
      </Flex>
    );
  };

  renderItem = ({ item }) => <CelebrateItem event={item} />;

  keyExtractor = item => {
    return item.id;
  };

  handleOnEndReached = () => {
    if (this.state.isListScrolled) {
      this.props.loadMoreItemsCallback();
      this.setState({ isListScrolled: false });
    }
  };

  handleEndDrag = () => {
    if (!this.state.isListScrolled) {
      this.setState({ isListScrolled: true });
    }
  };

  handleRefreshing = () => {
    this.props.refreshCallback();
  };

  render() {
    const { items } = this.props;

    return (
      <SectionList
        sections={items}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.2}
        onEndReached={this.handleOnEndReached}
        onScrollEndDrag={this.handleEndDrag}
        onRefresh={this.handleRefreshing}
        refreshing={false}
      />
    );
  }
}
