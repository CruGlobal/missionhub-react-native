import React, { useEffect } from 'react';
import { View, StatusBar, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { connect } from 'react-redux-legacy';

import { navigateBack, navigatePush } from '../../actions/navigation';
import {
  getChallenge,
  completeChallenge,
  joinChallenge,
  updateChallenge,
} from '../../actions/challenges';
import { AuthState } from '../../reducers/auth';
import { OrganizationsState } from '../../reducers/organizations';
import { Button } from '../../components/common';
import BackButton from '../BackButton';
import Header from '../../components/Header';
import BottomButton from '../../components/BottomButton';
import ChallengeDetailHeader from '../../components/ChallengeDetailHeader';
import { communityChallengeSelector } from '../../selectors/challenges';
import { orgPermissionSelector } from '../../selectors/people';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { isAdminOrOwner } from '../../utils/common';
import theme from '../../theme';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import CHALLENGE_TARGET from '../../../assets/images/challengeDetailsTarget.png';
import CHALLENGE_COMPLETE from '../../../assets/images/challengeComplete.png';

import styles from './styles';

interface ChallengeInterface {
  id: string;
  title: string;
  created_at: string;
  end_date: string;
  isPast: boolean;
  completed_at?: string;
  accepted_community_challenges: {
    id: string;
    person: {
      id: string;
    };
  }[];
}

interface ChallengeDetailScreenProps {
  challenge: ChallengeInterface;
  acceptedChallenge?: ChallengeInterface;
  canEditChallenges: boolean;
  myId: string;
}

const ChallengeDetailScreen = ({
  challenge,
  acceptedChallenge,
  canEditChallenges,
  myId,
}: ChallengeDetailScreenProps) => {
  const dispatch = useDispatch();
  useAnalytics(['challenge', 'detail']);
  const { t } = useTranslation('challengeFeeds');
  const orgId: string = useNavigationParam('orgId');

  useEffect(() => {
    dispatch(getChallenge(challenge.id));
  }, []);

  const getAcceptedChallenge = ({
    accepted_community_challenges,
  }: ChallengeInterface) => {
    return (accepted_community_challenges || []).find(
      c => c.person && c.person.id === myId,
    );
  };

  const editChallenge = (challenge: ChallengeInterface) => {
    dispatch(updateChallenge(challenge));
  };

  const handleEdit = (currentChallenge: ChallengeInterface) => {
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        isEdit: true,
        challenge: currentChallenge,
        onComplete: (updatedChallenge: ChallengeInterface) => {
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

  return (
    <View style={styles.pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={<BackButton iconStyle={{ color: theme.lightGrey }} />}
        right={
          !completed && !isPast && canEditChallenges ? (
            <Button
              testID="editButton"
              type="transparent"
              text={t('Edit').toUpperCase()}
              onPress={() => handleEdit(challenge)}
              style={styles.button}
              buttonTextStyle={styles.buttonText}
            />
          ) : null
        }
      />
      <ChallengeDetailHeader challenge={challenge} />
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

export const mapStateToProps = (
  {
    auth,
    organizations,
  }: { auth: AuthState; organizations: OrganizationsState },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { navigation }: any,
) => {
  const navParams = navigation.state.params || {};
  const { challengeId, orgId } = navParams;
  const myId = auth.person.id;

  const challenge = communityChallengeSelector(
    { organizations },
    { orgId, challengeId },
  );

  const acceptedChallenge =
    challenge.accepted_community_challenges &&
    challenge.accepted_community_challenges.find(
      // @ts-ignore
      c => c.person && c.person.id === myId,
    );

  const myOrgPerm = orgPermissionSelector(
    {},
    {
      person: auth.person,
      organization: { id: orgId },
    },
  );
  const canEditChallenges = myOrgPerm && isAdminOrOwner(myOrgPerm);

  return {
    myId,
    challenge,
    acceptedChallenge,
    canEditChallenges,
  };
};

export default connect(mapStateToProps)(ChallengeDetailScreen);

export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
