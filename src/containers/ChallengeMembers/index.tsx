import React from 'react';
import { FlatList, View, ScrollView, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Flex } from '../../components/common';
import Header from '../../components/Header';
import CloseButton, { CloseButtonTypeEnum } from '../../components/CloseButton';
import { acceptedChallengesSelector } from '../../selectors/challenges';
import { keyExtractorId } from '../../utils/common';
import { Person } from '../../reducers/people';
import { ChallengeItem } from '../../components/ChallengeStats';
import ChallengeMemberItem from '../../components/ChallengeMemberItem';
import { navigatePush } from '../../actions/navigation';
import { COMMUNITY_MEMBER_TABS } from '../Communities/Community/CommunityMembers/CommunityMember/CommunityMemberTabs';

import styles from './styles';

const ChallengeMembers = () => {
  const { t } = useTranslation('challengeMembers');
  const dispatch = useDispatch();
  const challenge: ChallengeItem = useNavigationParam('challenge');
  const completed: boolean = useNavigationParam('completed');
  useAnalytics(['challenge', 'detail', completed ? 'completed' : 'joined']);
  const acceptedChallenges = challenge.accepted_community_challenges;
  const currentAcceptedChallenge = useSelector(() =>
    acceptedChallengesSelector(
      {
        acceptedChallenges,
      },
      {},
    ),
  );

  const members = currentAcceptedChallenge.joined;

  const handleSelect = (person: Person) => {
    dispatch(
      navigatePush(COMMUNITY_MEMBER_TABS, {
        personId: person.id,
        communityId: challenge.organization.id,
      }),
    );
  };

  const renderItem = ({ item }: { item: ChallengeItem }) => {
    return (
      <ChallengeMemberItem
        item={item}
        onSelect={handleSelect}
        date={
          completed && item.completed_at ? item.completed_at : item.accepted_at
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        right={
          <CloseButton
            type={CloseButtonTypeEnum.circle}
            style={{ alignItems: 'flex-end', alignSelf: 'flex-end' }}
          />
        }
      />
      <ScrollView style={styles.container}>
        <Text style={styles.memberText}>
          {t('joined', { count: members.length })}
        </Text>
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
