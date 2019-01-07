import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { navigateBack, navigatePush } from '../../actions/navigation';
import {
  getChallenge,
  completeChallenge,
  joinChallenge,
  updateChallenge,
} from '../../actions/challenges';
import { IconButton, Button } from '../../components/common';
import Header from '../Header';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import ChallengeMembers from '../ChallengeMembers';
import ChallengeDetailHeader from '../../components/ChallengeDetailHeader';
import { communityChallengeSelector } from '../../selectors/challenges';
import { orgPermissionSelector } from '../../selectors/people';
import { ORG_PERMISSIONS } from '../../constants';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';

import styles from './styles';

const CHALLENGE_JOINED = 'nav/CHALLENGE_JOINED';
const CHALLENGE_COMPLETED = 'nav/CHALLENGE_COMPLETED';

export const CHALLENGE_DETAIL_TABS = [
  {
    name: i18next.t('challengeFeeds:joined'),
    navigationAction: CHALLENGE_JOINED,
    component: ({
      navigation: {
        state: {
          params: { challengeId, orgId },
        },
      },
    }) => (
      <ChallengeMembers
        challengeId={challengeId}
        orgId={orgId}
        completed={false}
      />
    ),
  },
  {
    name: i18next.t('challengeFeeds:completed'),
    navigationAction: CHALLENGE_COMPLETED,
    component: ({
      navigation: {
        state: {
          params: { challengeId, orgId },
        },
      },
    }) => (
      <ChallengeMembers
        challengeId={challengeId}
        orgId={orgId}
        completed={true}
      />
    ),
  },
];

@translate('challengeFeeds')
export class ChallengeDetailScreen extends Component {
  componentDidMount() {
    const { dispatch, challenge } = this.props;
    dispatch(getChallenge(challenge.id));
  }

  getAcceptedChallenge({ accepted_community_challenges }) {
    return accepted_community_challenges.find(
      c => c.person && c.person.id === this.props.myId,
    );
  }

  handleCancel = () => {
    this.props.dispatch(navigateBack());
  };

  editChallenge = challenge => {
    const { orgId, dispatch } = this.props;
    dispatch(updateChallenge(challenge, orgId));
  };

  handleEdit = () => {
    const { dispatch, challenge } = this.props;
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        isEdit: true,
        challenge,
        onComplete: updatedChallenge => {
          this.editChallenge(updatedChallenge);
          dispatch(navigateBack());
        },
      }),
    );
  };

  handleJoin = () => {
    const { orgId, dispatch, challenge } = this.props;
    dispatch(joinChallenge(challenge, orgId));
  };

  handleComplete = () => {
    const { orgId, dispatch, challenge } = this.props;
    const accepted_challenge = this.getAcceptedChallenge(challenge);
    if (!accepted_challenge) {
      return;
    }
    dispatch(completeChallenge(accepted_challenge, orgId));
  };

  render() {
    const { t, challenge, acceptedChallenge, canEditChallenges } = this.props;

    const { isPast } = challenge;
    const joined = !!acceptedChallenge;
    const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);

    return (
      <View>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.handleCancel}
              style={styles.buttonText}
            />
          }
          right={
            !completed && !isPast ? (
              <Button
                type="transparent"
                text={t(joined ? 'iDidIt' : 'join').toUpperCase()}
                onPress={joined ? this.handleComplete : this.handleJoin}
                style={styles.button}
                buttonTextStyle={styles.buttonText}
              />
            ) : null
          }
          shadow={false}
          style={styles.header}
        />
        <ChallengeDetailHeader
          challenge={challenge}
          canEditChallenges={canEditChallenges}
          onEdit={this.handleEdit}
        />
      </View>
    );
  }
}

ChallengeDetailScreen.propTypes = {
  challenge: PropTypes.object.isRequired,
  canEditChallenges: PropTypes.bool.isRequired,
  acceptedChallenge: PropTypes.object,
};

export const mapStateToProps = ({ auth, organizations }, { navigation }) => {
  const navParams = navigation.state.params || {};
  const { challengeId, orgId } = navParams;
  const myId = auth.person.id;

  const challenge = communityChallengeSelector(
    { organizations },
    { orgId, challengeId },
  );

  const acceptedChallenge =
    (challenge.accepted_community_challenges &&
      challenge.accepted_community_challenges.find(
        c => c.person && c.person.id === myId,
      )) ||
    {};

  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: orgId },
  });
  const canEditChallenges =
    myOrgPerm && myOrgPerm.permission_id === ORG_PERMISSIONS.ADMIN;

  return {
    ...navParams,
    myId,
    challenge,
    acceptedChallenge,
    canEditChallenges,
  };
};

const connectedDetailScreen = connect(mapStateToProps)(ChallengeDetailScreen);

export default generateSwipeTabMenuNavigator(
  CHALLENGE_DETAIL_TABS,
  connectedDetailScreen,
  false,
  true,
);

export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
