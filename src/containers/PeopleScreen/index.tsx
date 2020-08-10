import React from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { navigatePush } from '../../actions/navigation';
import { Button, RefreshControl } from '../../components/common';
import Header from '../../components/Header';
import BottomButton from '../../components/BottomButton';
import { PersonItem } from '../PersonItem';
import { PersonFragment } from '../PersonItem/__generated__/PersonFragment';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../routes/constants';
import { Organization } from '../../reducers/organizations';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../utils/hooks/useAnalytics';
import AddPersonIcon from '../../../assets/images/addPersonIcon.svg';
import AnnouncementsModal from '../../components/AnnouncementsModal';
import AvatarMenuButton from '../../components/AvatarMenuButton';
import { keyExtractorId } from '../../utils/common';
import { useMyId } from '../../utils/hooks/useIsMe';

import styles from './styles';
import { GET_PEOPLE } from './queries';
import { GetPeople } from './__generated__/GetPeople';

export const PeopleScreen = () => {
  useAnalytics('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
  const { t } = useTranslation('peopleScreen');
  const myId = useMyId();

  const dispatch = useDispatch();

  const {
    data: { currentUser, people: { nodes: peopleNodes = [] } = {} } = {},
    refetch,
    loading,
  } = useQuery<GetPeople>(GET_PEOPLE, { variables: { myId } });

  const peopleItems: PersonFragment[] = [
    ...(currentUser ? [currentUser.person] : []),
    ...peopleNodes,
  ];

  const handleAddContact = (org: Organization) => {
    dispatch(
      navigatePush(ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW, {
        organization: org && org.id ? org : undefined,
      }),
    );
  };

  const renderItem = () => ({ item }: { item: PersonFragment }) => {
    return <PersonItem person={item} />;
  };

  return (
    <View style={styles.pageContainer}>
      <AnnouncementsModal />
      <Header
        titleStyle={styles.headerTitle}
        testID="header"
        left={<AvatarMenuButton />}
        right={
          <Button onPress={handleAddContact}>
            <AddPersonIcon />
          </Button>
        }
        title={t('header')}
        shadow={true}
      />
      <FlatList
        data={peopleItems}
        style={styles.list}
        keyExtractor={keyExtractorId}
        renderItem={renderItem()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
      {peopleNodes.length === 0 ? (
        <BottomButton
          text={t('mainTabs:takeAStepWithSomeone')}
          onPress={handleAddContact}
        />
      ) : null}
    </View>
  );
};
