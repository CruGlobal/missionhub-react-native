import React, { useEffect } from 'react';
import { View, StatusBar, Image, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import {
  navigateBack,
  navigatePush,
  navigateToCommunityFeed,
} from '../../actions/navigation';
import {
  getChallenge,
  completeChallenge,
  joinChallenge,
  updateChallenge,
} from '../../actions/challenges';
import { AuthState } from '../../reducers/auth';
import { OrganizationsState } from '../../reducers/organizations';
import DeprecatedBackButton from '../DeprecatedBackButton';
import { Button, Touchable } from '../../components/common';
import Header from '../../components/Header';
import BottomButton from '../../components/BottomButton';
import ChallengeDetailHeader from '../../components/ChallengeDetailHeader';
import { ChallengeItem } from '../../components/ChallengeStats';
import { communityChallengeSelector } from '../../selectors/challenges';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import theme from '../../theme';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import CHALLENGE_TARGET from '../../../assets/images/challengeDetailsTarget.png';
import CHALLENGE_COMPLETE from '../../../assets/images/challengeComplete.png';

import styles from './styles';

const ChallengeDetailScreen = () => {
  const dispatch = useDispatch();
  useAnalytics(['challenge', 'detail']);
  const { t } = useTranslation('challengeFeeds');
  const orgId: string = useNavigationParam('orgId');
  const challengeId: string = useNavigationParam('challengeId');
  const communityName: string = useNavigationParam('communityName');
  const isAdmin: boolean = useNavigationParam('isAdmin');
  const fromNotificationCenterItem: boolean = useNavigationParam(
    'fromNotificationCenterItem',
  );
  const auth = useSelector(({ auth }: { auth: AuthState }) => auth);
  const myId = auth.person.id;

  const challenge: ChallengeItem = useSelector(
    ({ organizations }: { organizations: OrganizationsState }) =>
      communityChallengeSelector({ organizations }, { orgId, challengeId }),
  );
  const acceptedChallenge =
    challenge.accepted_community_challenges &&
    challenge.accepted_community_challenges.find(
      c => c.person && c.person.id === myId,
    );

  const canEditChallenges = isAdmin;

  useEffect(() => {
    // needed to update redux with newest challenges
    dispatch(getChallenge(challenge.id));
  }, []);

  const getAcceptedChallenge = ({
    accepted_community_challenges,
  }: ChallengeItem) => {
    return (accepted_community_challenges || []).find(
      c => c.person && c.person.id === myId,
    );
  };

  const editChallenge = (challenge: ChallengeItem) => {
    dispatch(updateChallenge(challenge));
  };

  const handleEdit = (currentChallenge: ChallengeItem) => {
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        isEdit: true,
        challenge: currentChallenge,
        communityId: orgId,
        onComplete: (updatedChallenge: ChallengeItem) => {
          editChallenge(updatedChallenge);
          dispatch(navigateBack());
        },
      }),
    );
  };

  const handleJoin = () => {
    dispatch(joinChallenge(challenge, orgId));
  };

  const handleComplete = () => {
    const accepted_challenge = getAcceptedChallenge(challenge);
    if (!accepted_challenge) {
      return;
    }
    dispatch(completeChallenge(accepted_challenge, orgId));
  };

  const { isPast } = challenge;
  const joined = !!acceptedChallenge;
  const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);

  const handleCommunityNamePress = () => {
    fromNotificationCenterItem
      ? dispatch(navigateToCommunityFeed(orgId))
      : dispatch(navigateBack());
  };

  return (
    <View style={styles.pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={<DeprecatedBackButton iconStyle={{ color: theme.lightGrey }} />}
        center={
          !communityName ? (
            undefined
          ) : (
            <Touchable
              testID="CommunityNameHeader"
              onPress={handleCommunityNamePress}
            >
              <Text style={styles.headerText}>{communityName}</Text>
            </Touchable>
          )
        }
        right={
          !isPast && canEditChallenges ? (
            <Button
              testID="editButton"
              type="transparent"
              text={t('edit').toUpperCase()}
              onPress={() => handleEdit(challenge)}
              style={styles.button}
              buttonTextStyle={styles.buttonText}
            />
          ) : null
        }
      />
      <ChallengeDetailHeader challenge={challenge} isAdmin={isAdmin} />
      <Image source={CHALLENGE_TARGET} style={styles.challengeImage} />
      {!completed && !isPast ? (
        <BottomButton
          image={joined ? CHALLENGE_COMPLETE : null}
          testID="handleButton"
          text={t(joined ? 'iDidIt' : 'join').toUpperCase()}
          onPress={joined ? handleComplete : handleJoin}
        />
      ) : null}
    </View>
  );
};

export default ChallengeDetailScreen;

export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
