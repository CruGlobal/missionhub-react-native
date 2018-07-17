import React, { Component } from 'react';
import { SectionList } from 'react-native';

import { DateComponent, Flex } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import styles from './styles';

export default class CelebrateFeed extends Component {
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
      />
    );
  }
}
