import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
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
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { IconButton, Button } from '../../components/common';
import Header from '../../components/Header';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import ChallengeMembers from '../ChallengeMembers';
import ChallengeDetailHeader from '../../components/ChallengeDetailHeader';
import { communityChallengeSelector } from '../../selectors/challenges';
import { orgPermissionSelector } from '../../selectors/people';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { isAdminOrOwner, getAnalyticsPermissionType } from '../../utils/common';
import theme from '../../theme';
import Analytics from '../Analytics';

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
          // @ts-ignore
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
          // @ts-ignore
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

  handleEdit = () => {
    // @ts-ignore
    const { dispatch, challenge, organization } = this.props;
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        organization,
        isEdit: true,
        challenge,
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
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      challenge,
      // @ts-ignore
      acceptedChallenge,
      // @ts-ignore
      canEditChallenges,
      // @ts-ignore
      analyticsPermissionType,
    } = this.props;

    const { isPast } = challenge;
    const joined = !!acceptedChallenge;
    const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);

    return (
      <View style={styles.pageContainer}>
        <Analytics
          screenName={['challenge', 'detail']}
          screenContext={{
            [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
          }}
        />
        <StatusBar {...theme.statusBar.darkContent} />
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
    analyticsPermissionType: getAnalyticsPermissionType(myOrgPerm),
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
