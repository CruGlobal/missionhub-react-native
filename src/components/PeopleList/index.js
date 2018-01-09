import React, { Component } from 'react';
import { FlatList, ScrollView, LayoutAnimation, UIManager } from 'react-native';
import PropTypes from 'prop-types';

// For Android to work with the Layout Animation
// See https://facebook.github.io/react-native/docs/layoutanimation.html
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import PeopleItem from '../PeopleItem';
import { Flex, Text, Icon, Touchable, RefreshControl } from '../common';
import { merge } from '../../utils/common';
import styles from './styles';

export default class PeopleList extends Component {
  
  constructor(props) {
    super(props);

    const items = (props.items || []).map((s) => ({ ...s, expanded: true }));
    this.state = {
      items,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.length !== this.props.items.length) {
      const items = merge([], this.state.items, nextProps.items);
      this.setState({ items });
    }
  }

  toggleSection(key) {
    const items = this.state.items.map((s) => s.key === key ? { ...s, expanded: !s.expanded } : s);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ items });
  }

  renderList(items) {
    const { onSelect, myId, sections, refreshing, onRefresh } = this.props;
    
    return (
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(i) => i.id}
        scrollEnabled={!sections}
        renderItem={({ item }) => (
          <PeopleItem
            isMe={item.id === myId}
            onSelect={onSelect}
            person={item} />
        )}
        refreshControl={!sections ? <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        /> : undefined}
      />
    );
  }

  renderSectionHeader(section) {
    const { onAddContact } = this.props;
    
    return (
      <Flex align="center" direction="row" style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {section.key}
        </Text>
        <Flex direction="row" justify="end">
          <Touchable onPress={() => onAddContact(section.key)}>
            <Icon name="plusIcon" type="MissionHub" size={20} style={styles.icon} />
          </Touchable>
          <Touchable onPress={() => this.toggleSection(section.key)}>
            <Icon name="moreIcon" type="MissionHub" size={20} style={styles.icon} />
          </Touchable>
        </Flex>
      </Flex>
    );
  }
  
  render() {
    const { items, sections, refreshing, onRefresh } = this.props;
    if (sections) {
      return (
        <ScrollView
          style={styles.sectionWrap}
          bounces={false}
          scrollEnabled={true}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        >
          {
            this.state.items.map((section) => (
              <Flex key={section.key}>
                {this.renderSectionHeader(section)}
                {
                  section.expanded ? this.renderList(section.data) : null
                }
              </Flex>
            ))
          }
        </ScrollView>
      );
    }
    return this.renderList(items);
  }

}

PeopleList.propTypes = {
  sections: PropTypes.bool,
  items: PropTypes.array.isRequired,
  myId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
