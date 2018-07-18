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

  handleOnEndReached() {
    if (this.state.isListScrolled) {
      this.props.loadMoreItemsCallback();
      this.setState({ isListScrolled: false });
    }
  }

  handleEndDrag() {
    if (!this.state.isListScrolled) {
      this.setState({ isListScrolled: true });
    }
  }

  render() {
    const { title, header } = styles;
    const { items } = this.props;

    return (
      <SectionList
        sections={items}
        renderSectionHeader={({ section: { date } }) => (
          <Flex style={header} align="center">
            <DateComponent date={date} format={'relative'} style={title} />
          </Flex>
        )}
        renderItem={({ item }) => <CelebrateItem event={item} />}
        keyExtractor={item => {
          return item.id;
        }}
        onEndReachedThreshold={0.2}
        onEndReached={() => this.handleOnEndReached()}
        onScrollEndDrag={() => this.handleEndDrag()}
      />
    );
  }
}
