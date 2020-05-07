import React from 'react';
import { Image, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import SEARCH_NULL from '../../../assets/images/searchNull.png';
import { Flex, Text } from '../../components/common';
import GroupsContactItem from '../../components/GroupsContactItem';
import AssignToMeButton from '../AssignToMeButton/index';
import { CommunityMemberPerson } from '../CommunityMemberItem/__generated__/CommunityMemberPerson';

import styles from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActivityItem = any;

interface GroupsContactListProps {
  activity: ActivityItem[];
  person: CommunityMemberPerson;
  organization: object;
  myId: string;
  onAssign?: () => void;
}

const GroupsContactList = ({
  activity,
  person,
  myId,
  onAssign,
  organization,
}: GroupsContactListProps) => {
  const { t } = useTranslation('groupsContactList');
  const keyExtractor = (i: ActivityItem) => `${i.id}-${i._type}`;
  const renderItem = ({ item }: { item: ActivityItem }) => {
    return <GroupsContactItem person={person} item={item} myId={myId} />;
  };
  function renderContent() {
    if (activity.length === 0) {
      return (
        <Flex align="center" justify="center" value={1} style={styles.nullWrap}>
          <Image source={SEARCH_NULL} />
          <Text header={true} style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>{t('nullDescription')}</Text>
        </Flex>
      );
    }
    return (
      <FlatList
        data={activity}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    );
  }
  return (
    <Flex style={{ flex: 1 }}>
      <Flex style={styles.header} align="center" justify="center">
        <Text style={styles.name}>{person.fullName}</Text>
        <AssignToMeButton
          person={person}
          organization={organization}
          onComplete={onAssign}
        />
      </Flex>
      <Flex value={1} style={styles.content}>
        {renderContent()}
      </Flex>
    </Flex>
  );
};

export default GroupsContactList;
