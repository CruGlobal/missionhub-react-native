/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FlatList, ScrollView, LayoutAnimation, UIManager } from 'react-native';
import { useTranslation } from 'react-i18next';

// For Android to work with the Layout Animation
// See https://facebook.github.io/react-native/docs/layoutanimation.html
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

import PersonItem from '../../containers/PersonItem';
import { Flex, Text, RefreshControl } from '../common';
import { keyExtractorId } from '../../utils/common';
import IconButton from '../IconButton';

import styles from './styles';

interface PeopleListProps {
  items: any;
  sections: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onSelect: (person: PersonAttributes, org: any) => void;
  onAddContact: (org: any) => void;
  testID?: string;
}

export default ({
  items,
  sections,
  refreshing,
  onRefresh,
  onSelect,
  onAddContact,
}: PeopleListProps) => {
  const { t } = useTranslation('peopleScreen');

  const [collapsedOrgs, setCollapsedOrgs] = useState(new Set<string>());

  const toggleSection = (id: string) => {
    collapsedOrgs.has(id) ? collapsedOrgs.delete(id) : collapsedOrgs.add(id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedOrgs(new Set(collapsedOrgs));
  };

  const renderItem = (organization: any) => ({ item }: { item: any }) => (
    <PersonItem onSelect={onSelect} person={item} organization={organization} />
  );

  const renderList = (items: any, organization?: any) => {
    return (
      <FlatList
        data={items}
        keyExtractor={keyExtractorId}
        scrollEnabled={!sections}
        renderItem={renderItem(organization)}
        refreshControl={
          !sections ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : (
            undefined
          )
        }
        style={styles.sectionWrap}
      />
    );
  };

  const renderSectionHeader = (org: any) => {
    return (
      <Flex align="center" direction="row" style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {org.name || t('personalMinistry')}
        </Text>
        <Flex direction="row" justify="end" align="center">
          {!org.user_created ? (
            <IconButton
              testID="addContactBtn"
              name="addContactIcon"
              type="MissionHub"
              size={24}
              pressProps={[org && org.id !== 'personal' ? org : undefined]}
              onPress={onAddContact}
            />
          ) : null}
          <IconButton
            testID="toggleSectionBtn"
            name={collapsedOrgs.has(org.id) ? 'downArrowIcon' : 'upArrowIcon'}
            type="MissionHub"
            size={10}
            pressProps={[org.id]}
            onPress={toggleSection}
          />
        </Flex>
      </Flex>
    );
  };

  if (sections) {
    return (
      <ScrollView
        style={styles.sectionWrap}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.map((org: any) => (
          <Flex key={org.id}>
            {renderSectionHeader(org)}
            {collapsedOrgs.has(org.id) ? null : renderList(org.people, org)}
          </Flex>
        ))}
      </ScrollView>
    );
  }
  return renderList(items);
};
