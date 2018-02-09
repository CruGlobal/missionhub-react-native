import React, { Component } from 'react';
import { FlatList, ScrollView, LayoutAnimation, UIManager } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// For Android to work with the Layout Animation
// See https://facebook.github.io/react-native/docs/layoutanimation.html
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import PeopleItem from '../../containers/PeopleItem';
import { Flex, Text, Icon, Touchable, RefreshControl } from '../common';
import { merge } from '../../utils/common';
import styles from './styles';

@translate('peopleScreen')
export default class PeopleList extends Component {

  constructor(props) {
    super(props);

    const items = (props.items || []).map((s) => ({ ...s, expanded: true }));
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

  toggleSection(id) {
    const items = this.state.items.map((org) => org.id === id ? { ...org, expanded: !org.expanded } : org);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ items });
  }

  renderList(items, organization) {
    const { onSelect, sections, refreshing, onRefresh } = this.props;
    
    return (
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(i) => i.id}
        scrollEnabled={!sections}
        renderItem={({ item }) => (
          <PeopleItem
            onSelect={onSelect}
            person={item}
            organization={organization} />
        )}
        refreshControl={!sections ? <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        /> : undefined}
      />
    );
  }

  renderSectionHeader(org) {
    const { onAddContact, t } = this.props;
    return (
      <Flex align="center" direction="row" style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {org.name || t('personalMinistry')}
        </Text>
        <Flex direction="row" justify="end" align="center">
          <Touchable onPress={() => onAddContact(org && org.id !== 'personal' ? org : undefined)}>
            <Icon name="plusIcon" type="MissionHub" size={20} style={styles.icon} />
          </Touchable>
          <Touchable onPress={() => this.toggleSection(org.id)}>
            <Icon
              name={org.expanded ? 'upArrowIcon' : 'downArrowIcon'}
              type="MissionHub"
              size={15}
              style={[
                styles.icon,
              ]} />
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
          bounces={true}
          scrollEnabled={true}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        >
          {
            this.state.items.map((org) => (
              <Flex key={org.id}>
                {this.renderSectionHeader(org)}
                {
                  org.expanded ? this.renderList(org.people, org) : null
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
  items: PropTypes.array.isRequired,
  sections: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};
