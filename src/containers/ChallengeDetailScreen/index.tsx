import React, { Component } from 'react';
import { View, StatusBar, Image } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { navigateBack, navigatePush } from '../../actions/navigation';
import {
  getChallenge,
  completeChallenge,
  joinChallenge,
  updateChallenge,
} from '../../actions/challenges';
import { Button } from '../../components/common';
import BackButton from '../BackButton';
import Header from '../../components/Header';
import ChallengeMembers from '../ChallengeMembers';
import ChallengeDetailHeader from '../../components/ChallengeDetailHeader';
import { communityChallengeSelector } from '../../selectors/challenges';
import { orgPermissionSelector } from '../../selectors/people';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { isAdminOrOwner } from '../../utils/common';
import theme from '../../theme';
import Analytics from '../Analytics';
import CHALLENGE_TARGET from '../../../assets/images/challengeDetailsTarget.png';

import styles from './styles';
import BottomButton from '../../components/BottomButton';

// @ts-ignore
@withTranslation('challengeFeeds')
export class ChallengeDetailScreen extends Component {
  componentDidMount() {
    // @ts-ignore
    const { dispatch, challenge } = this.props;
    dispatch(getChallenge(challenge.id));
  }

  // @ts-ignore
  getAcceptedChallenge({ accepted_community_challenges }) {
    return (accepted_community_challenges || []).find(
      // @ts-ignore
      c => c.person && c.person.id === this.props.myId,
    );
  }

  handleCancel = () => {
    // @ts-ignore
    this.props.dispatch(navigateBack());
  };

  // @ts-ignore
  editChallenge = challenge => {
    // @ts-ignore
    const { orgId, dispatch } = this.props;
    // @ts-ignore
    dispatch(updateChallenge(challenge, orgId));
  };

  handleEdit = (currentChallenge: any) => {
    // @ts-ignore
    const { dispatch } = this.props;
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        isEdit: true,
        challenge: currentChallenge,
        // @ts-ignore
        onComplete: updatedChallenge => {
          this.editChallenge(updatedChallenge);
          dispatch(navigateBack());
        },
      }),
    );
  };

  handleJoin = () => {
    // @ts-ignore
    const { orgId, dispatch, challenge } = this.props;
    dispatch(joinChallenge(challenge, orgId));
  };

  handleComplete = () => {
    // @ts-ignore
    const { orgId, dispatch, challenge } = this.props;
    const accepted_challenge = this.getAcceptedChallenge(challenge);
    if (!accepted_challenge) {
      return;
    }
    dispatch(completeChallenge(accepted_challenge, orgId));
  };

  render() {
    // @ts-ignore
    const { t, challenge, acceptedChallenge, canEditChallenges } = this.props;

    const { isPast } = challenge;
    const joined = !!acceptedChallenge;
    const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);

    return (
      <View style={styles.pageContainer}>
        <Analytics screenName={['challenge', 'detail']} />
        <StatusBar {...theme.statusBar.darkContent} />
        <Header
          left={<BackButton iconStyle={{ color: theme.lightGrey }} />}
          right={
            !completed && !isPast && canEditChallenges ? (
              <Button
                type="transparent"
                text={t('Edit').toUpperCase()}
                onPress={() => this.handleEdit(challenge)}
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
            text={t(joined ? 'iDidIt' : 'join').toUpperCase()}
            onPress={joined ? this.handleComplete : this.handleJoin}
          />
        ) : null}
      </View>
    );
  }
}

// @ts-ignore
ChallengeDetailScreen.propTypes = {
  challenge: PropTypes.object.isRequired,
  canEditChallenges: PropTypes.bool.isRequired,
  acceptedChallenge: PropTypes.object,
};

// @ts-ignore
export const mapStateToProps = ({ auth, organizations }, { navigation }) => {
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

  // @ts-ignore
  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: orgId },
  });
  const canEditChallenges = myOrgPerm && isAdminOrOwner(myOrgPerm);

  return {
    ...navParams,
    myId,
    challenge,
    acceptedChallenge,
    canEditChallenges,
  };
};

export default connect(mapStateToProps)(ChallengeDetailScreen);

export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
