import React, { Component } from 'react';
import { FlatList, ScrollView, LayoutAnimation, UIManager } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// For Android to work with the Layout Animation
// See https://facebook.github.io/react-native/docs/layoutanimation.html
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

import PeopleItem from '../../containers/PeopleItem';
import { Flex, Text, RefreshControl } from '../common';
import { merge } from '../../utils/common';
import IconButton from '../IconButton';

import styles from './styles';

@translate('peopleScreen')
export default class PeopleList extends Component {
  constructor(props) {
    super(props);

    const items = (props.items || []).map(s => ({ ...s, expanded: true }));
    this.state = {
      items,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sections) {
      // Format section items merging in the existing expanded state.
      const items = nextProps.items.map((i, index) => {
        if (this.state.items[index] && this.state.items[index].id === i.id) {
          return { ...this.state.items[index], ...i };
        }
        return { ...i, expanded: true };
      });
      this.setState({ items });
      this.forceUpdate();
    } else if (nextProps.items.length !== this.props.items.length) {
      const items = merge([], this.state.items, nextProps.items);
      this.setState({ items });
    }
  }

  toggleSection = id => {
    const items = this.state.items.map(
      org => (org.id === id ? { ...org, expanded: !org.expanded } : org),
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ items });
  };

  keyExtractor = i => i.id;

  // This still technically creates an arrow function every time it gets rendered, thus breaking
  // the "react/jsx-no-bind" linting rule. But there's not really another way around it unless
  // we create an entirely new component wrapper around the <FlatList> that applies props to it.
  // See <RadioButton>, <IconButton>, <Button>, <RowSwipeable>, and <Touchable> components for how to do it
  renderItem = organization => ({ item }) => (
    <PeopleItem
      onSelect={this.props.onSelect}
      person={item}
      organization={organization}
    />
  );

  renderList(items, organization) {
    const { sections, refreshing, onRefresh } = this.props;

    return (
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={this.keyExtractor}
        scrollEnabled={!sections}
        renderItem={this.renderItem(organization)}
        refreshControl={
          !sections ? (
            <RefreshControl
              refreshing={refreshing || false}
              onRefresh={onRefresh}
            />
          ) : (
            undefined
          )
        }
      />
    );
  }

  handleAddContact = arg => this.props.onAddContact(arg);

  renderSectionHeader(org) {
    const { t } = this.props;
    return (
      <Flex align="center" direction="row" style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {org.name || t('personalMinistry')}
        </Text>
        <Flex direction="row" justify="end" align="center">
          <IconButton
            name="addContactIcon"
            type="MissionHub"
            size={24}
            pressProps={[org && org.id !== 'personal' ? org : undefined]}
            onPress={this.handleAddContact}
          />
          <IconButton
            name={org.expanded ? 'upArrowIcon' : 'downArrowIcon'}
            type="MissionHub"
            size={10}
            pressProps={[org.id]}
            onPress={this.toggleSection}
          />
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing || false}
              onRefresh={onRefresh}
            />
          }
        >
          {this.state.items.map(org => (
            <Flex key={org.id}>
              {this.renderSectionHeader(org)}
              {org.expanded ? this.renderList(org.people, org) : null}
            </Flex>
          ))}
        </ScrollView>
      );
    }
    return this.renderList(items[0].people);
  }
}

PeopleList.propTypes = {
  items: PropTypes.array.isRequired,
  sections: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};
