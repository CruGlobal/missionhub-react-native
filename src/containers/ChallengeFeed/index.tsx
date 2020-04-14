import React, { useState } from 'react';
import { SectionList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Text } from '../../components/common';
import ChallengeItem from '../../components/ChallengeItem';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
  PermissionTypesEnum,
} from '../Groups/OnboardingCard';
import { navigatePush } from '../../actions/navigation';
import { completeChallenge, joinChallenge } from '../../actions/challenges';
import { orgPermissionSelector } from '../../selectors/people';
import { isAdminOrOwner, isAndroid } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { CHALLENGE_DETAIL_SCREEN } from '../ChallengeDetailScreen';
import { ACTIONS } from '../../constants';
import { keyExtractorId } from '../../utils/common';
import NullStateComponent from '../../components/NullStateComponent';
import TARGET from '../../../assets/images/challengeTarget.png';
import { AuthState } from '../../reducers/auth';
import { ChallengeItem as ChallengeItemInterface } from '../../components/ChallengeStats';
import { SwipeState } from '../../reducers/swipe';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

interface ItemsInterface {
  title: string;
  data: ChallengeItemInterface[];
}

interface ChallengeFeedProps {
  organization: Organization;
  refreshing: boolean;
  refreshCallback: () => void;
  items: ItemsInterface[];
  extraPadding: boolean;
  loadMoreItemsCallback: () => void;
}

const ChallengeFeed = ({
  organization,
  refreshing,
  refreshCallback,
  items,
  extraPadding,
  loadMoreItemsCallback,
}: ChallengeFeedProps) => {
  const { t } = useTranslation('challengeFeeds');
  useAnalytics(['challenge', 'feed']);
  const dispatch = useDispatch();
  const auth = useSelector(({ auth }: { auth: AuthState }) => auth);
  const myId = auth.person.id;
  const person = auth.person;
  const orgPerm = useSelector(() =>
    orgPermissionSelector(
      {},
      {
        person,
        organization,
      },
    ),
  );

  const isOnboardingCardVisible = useSelector(
    ({ swipe }: { swipe: SwipeState }) => swipe.groupOnboarding.challenges,
  );

  const adminOrOwner = isAdminOrOwner(orgPerm);
  const [isListScrolled, setListScrolled] = useState(false);
  const getAcceptedChallenge = ({
    accepted_community_challenges,
  }: ChallengeItemInterface) => {
    return (
      accepted_community_challenges &&
      accepted_community_challenges.find(c => c.person && c.person.id === myId)
    );
  };
  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const handleComplete = (challenge: ChallengeItemInterface) => {
    const accepted_challenge = getAcceptedChallenge(challenge);

    if (!accepted_challenge) {
      return;
    }
    dispatch(completeChallenge(accepted_challenge, organization.id));
  };

  const handleJoin = (challenge: ChallengeItemInterface) => {
    dispatch(joinChallenge(challenge, organization.id));
  };

  const handleSelectRow = (challenge: ChallengeItemInterface) => {
    dispatch(
      navigatePush(CHALLENGE_DETAIL_SCREEN, {
        challengeId: challenge.id,
        orgId: organization.id,
        isAdmin: adminOrOwner,
      }),
    );
    dispatch(trackActionWithoutData(ACTIONS.CHALLENGE_DETAIL));
  };

  const renderItem = ({ item }: { item: ChallengeItemInterface }) => (
    <ChallengeItem
      item={item}
      onComplete={handleComplete}
      onJoin={handleJoin}
      onSelect={handleSelectRow}
      // @ts-ignore
      acceptedChallenge={getAcceptedChallenge(item)}
    />
  );

  const handleOnEndReached = () => {
    if (isListScrolled && !refreshing) {
      loadMoreItemsCallback();
      setListScrolled(false);
    }
  };

  const handleEndDrag = () => {
    if (!isListScrolled) {
      setListScrolled(true);
    }
  };

  const handleRefreshing = () => {
    refreshCallback();
  };
  const renderHeader = () => (
    <OnboardingCard
      type={GROUP_ONBOARDING_TYPES.challenges}
      permissions={
        adminOrOwner ? PermissionTypesEnum.admin : PermissionTypesEnum.member
      }
    />
  );
  const renderNull = () => {
    return (
      <>
        {isOnboardingCardVisible ? (
          renderHeader()
        ) : (
          <NullStateComponent
            style={styles.nullContainer}
            imageSource={TARGET}
            headerText={t('nullTitle')}
            descriptionText={adminOrOwner ? t('nullAdmins') : t('nullMembers')}
          />
        )}
      </>
    );
  };

  const itemCount: number = items.reduce(
    (count, element) => count + element.data.length,
    0,
  );

  if (itemCount === 0) {
    return renderNull();
  }

  return (
    <SectionList
      testID="ChallengeFeed"
      sections={items}
      ListHeaderComponent={renderHeader}
      // @ts-ignore
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractorId}
      onEndReachedThreshold={0.2}
      onEndReached={handleOnEndReached}
      onScrollEndDrag={handleEndDrag}
      onRefresh={handleRefreshing}
      refreshing={refreshing || false}
      extraData={isListScrolled}
      contentContainerStyle={[
        styles.list,
        isAndroid ? { paddingBottom: extraPadding ? 90 : 10 } : {},
      ]}
      contentInset={{ bottom: extraPadding ? 90 : 10 }}
    />
  );
};

export default ChallengeFeed;
