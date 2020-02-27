import React from 'react';
import { FlatList, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Flex, Text } from '../../components/common';
import Header from '../../components/Header';
import BackButton from '../../containers/BackButton';
import { navToPersonScreen } from '../../actions/person';
import { organizationSelector } from '../../selectors/organizations';
import { acceptedChallengesSelector } from '../../selectors/challenges';
import { keyExtractorId } from '../../utils/common';
import { Person } from '../../reducers/people';
import CLOSE_BUTTON from '../../../assets/images/closeButton.png';
import { ChallengeItem } from '../../components/ChallengeStats';
import ChallengeMemberItem from '../../components/ChallengeMemberItem';
import { OrganizationsState } from '../../reducers/organizations';

import styles from './styles';

const ChallengeMembers = () => {
  const { t } = useTranslation('challengeMembers');
  const dispatch = useDispatch();
  const challenge: ChallengeItem = useNavigationParam('challenge');
  const orgId = useNavigationParam('orgId');
  const completed: boolean = useNavigationParam('completed');
  useAnalytics(['challenge', 'detail', completed ? 'completed' : 'joined']);
  const organization = useSelector(
    ({ organizations }: { organizations: OrganizationsState }) =>
      organizationSelector({ organizations }, { orgId }),
  );
  const acceptedChallenges = challenge.accepted_community_challenges;
  const currentAcceptedChallenge = useSelector(() =>
    acceptedChallengesSelector(
      {
        acceptedChallenges,
      },
      {},
    ),
  );

  const members = completed
    ? currentAcceptedChallenge.completed
    : currentAcceptedChallenge.joined;

  const handleSelect = (person: Person) => {
    dispatch(navToPersonScreen(person, organization));
  };

  const memberText = () => {
    if (completed) {
      return members.length > 1 ? t('pluralCompleted') : t('completed');
    } else {
      return members.length > 1 ? t('pluralJoined') : t('joined');
    }
  };

  const renderItem = ({ item }: { item: ChallengeItem }) => {
    return (
      <ChallengeMemberItem
        item={item}
        onSelect={handleSelect}
        date={completed ? item.completed_at : item.accepted_at}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        right={
          <BackButton
            image={CLOSE_BUTTON}
            style={{ alignItems: 'flex-end', alignSelf: 'flex-end' }}
          />
        }
      />
      <ScrollView style={styles.container}>
        <Text style={styles.memberText}>{`${
          members.length
        } ${memberText()}`}</Text>
        <Flex value={1} style={{ paddingTop: 20 }}>
          <FlatList
            data={members}
            keyExtractor={keyExtractorId}
            style={styles.flatList}
            renderItem={renderItem}
          />
        </Flex>
      </ScrollView>
    </View>
  );
};

export default ChallengeMembers;
export const CHALLENGE_MEMBERS_SCREEN = 'nav/CHALLENGE_MEMBERS_SCREEN';
