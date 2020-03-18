/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  ScrollView,
  LayoutAnimation,
  UIManager,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';

// For Android to work with the Layout Animation
// See https://facebook.github.io/react-native/docs/layoutanimation.html
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

import IconButton from '../IconButton';
import PersonItem from '../../containers/PersonItem';
import { Flex, Text, RefreshControl } from '../common';
import { keyExtractorId } from '../../utils/common';
import { ErrorNotice } from '../ErrorNotice/ErrorNotice';

import {
  GetPeopleStepsCount,
  GetPeopleStepsCount_communities_nodes_people_nodes as PersonStepCount,
} from './__generated__/GetPeopleStepsCount';
import { GET_PEOPLE_STEPS_COUNT } from './queries';
import styles from './styles';

interface PeopleListProps {
  items: any;
  sections: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onAddContact: (org: any) => void;
  testID?: string;
  personId: string;
}

export default ({
  items,
  sections,
  refreshing,
  onRefresh,
  onAddContact,
  personId,
}: PeopleListProps) => {
  const { t } = useTranslation('peopleScreen');
  const [collapsedOrgs, setCollapsedOrgs] = useState(new Set<string>());
  const {
    data,
    refetch: refetchPeopleStepsCount,
    error: peopleStepsCountError,
  } = useQuery<GetPeopleStepsCount>(GET_PEOPLE_STEPS_COUNT, {
    variables: {
      myId: [personId],
    },
  });

  const peopleStepCounts: {
    [key: string]: PersonStepCount;
  } = !data
    ? {}
    : [
        {
          __typename: data.currentUser.person.__typename,
          id: data.currentUser.person.id,
          steps: data.currentUser.person.steps,
        },
        ...data.currentUser.person.contactAssignments.nodes.map(
          node => node.person,
        ),
        ...data.communities.nodes.flatMap(node => node.people.nodes),
      ].reduce(
        (
          accumulator: {
            [key: string]: PersonStepCount;
          },
          currentValue,
        ) => {
          accumulator[currentValue.id] = currentValue;
          return accumulator;
        },
        {},
      );

  useEffect(() => {
    refetchPeopleStepsCount();
  }, [onRefresh]);

  const toggleSection = (id: string) => {
    collapsedOrgs.has(id) ? collapsedOrgs.delete(id) : collapsedOrgs.add(id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedOrgs(new Set(collapsedOrgs));
  };

  const renderItem = (organization: any) => ({ item }: { item: any }) => {
    return (
      <PersonItem
        person={item}
        organization={organization}
        stepsData={peopleStepCounts[item.id]}
      />
    );
  };

  const renderList = (items: any, organization?: any) => {
    return (
      <FlatList
        data={items}
        style={styles.list}
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

  return (
    <>
      <ErrorNotice
        message={t('errorLoadingStepCounts')}
        error={peopleStepsCountError}
        refetch={refetchPeopleStepsCount}
      />
      {sections ? (
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
      ) : (
        <View style={styles.sectionWrap}>{renderList(items)}</View>
      )}
    </>
  );
};
