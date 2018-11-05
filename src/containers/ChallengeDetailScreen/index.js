import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { navigateBack } from '../../actions/navigation';
import { getChallenge } from '../../actions/challenges';
import { IconButton, Button } from '../../components/common';
import Header from '../Header';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import ChallengeMembers from '../ChallengeMembers';
import ChallengeDetailHeader from '../../components/ChallengeDetailHeader';
import { communityChallengeSelector } from '../../selectors/challenges';

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

  handleCancel = () => {
    this.props.dispatch(navigateBack());
  };
  handleEdit = () => {
    const { challenge, onEdit } = this.props;
    onEdit && onEdit(challenge);
  };
  handleJoin = () => {
    const { challenge, onJoin } = this.props;
    onJoin(challenge);
  };
  handleComplete = () => {
    const { challenge, onComplete } = this.props;
    onComplete(challenge);
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
  onComplete: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  canEditChallenges: PropTypes.bool.isRequired,
  acceptedChallenge: PropTypes.object.isRequired,
};

export const mapStateToProps = ({ auth, organizations }, { navigation }) => {
  const navParams = navigation.state.params || {};
  const challengeId = navParams.challengeId;
  const orgId = navParams.orgId;
  const myId = auth.person.id;

  const selectorChallenge = communityChallengeSelector(
    { organizations },
    { orgId, challengeId },
  );

  const acceptedChallenge = selectorChallenge.accepted_community_challenges.find(
    c => c.person && c.person.id === myId,
  );

  return {
    ...navParams,
    challenge: selectorChallenge,
    acceptedChallenge,
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
