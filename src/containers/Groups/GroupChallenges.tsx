import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';

import Analytics from '../Analytics';
import ChallengeFeed from '../ChallengeFeed';
import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
  createChallenge,
} from '../../actions/challenges';
import BottomButton from '../../components/BottomButton';
import { organizationSelector } from '../../selectors/organizations';
import { refresh, isAdminOrOwner } from '../../utils/common';
import { challengesSelector } from '../../selectors/challenges';
import { navigatePush, navigateToCommunity } from '../../actions/navigation';
import { refreshCommunity } from '../../actions/organizations';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { orgPermissionSelector } from '../../selectors/people';
import { CELEBRATION_SCREEN } from '../CelebrationScreen';
import { ChallengeItem } from '../../components/ChallengeStats';

import { GROUP_CHALLENGES } from './GroupScreen';
import styles from './styles';

// @ts-ignore
@withTranslation('groupsChallenge')
class GroupChallenges extends Component {
  state = { refreshing: false };

  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(getGroupChallengeFeed(organization.id));
  };

  reloadItems = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(refreshCommunity(organization.id));
    return dispatch(reloadGroupChallengeFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  createChallenge = (challenge: ChallengeItem) => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(createChallenge(challenge, organization.id));
  };

  create = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        onComplete: (challenge: ChallengeItem) => {
          this.createChallenge(challenge);
          dispatch(
            navigatePush(CELEBRATION_SCREEN, {
              onComplete: () => {
                dispatch(navigateToCommunity(organization, GROUP_CHALLENGES));
              },
            }),
          );
        },
      }),
    );
  };

  render() {
    const { refreshing } = this.state;
    // @ts-ignore
    const { t, challengeItems, organization, myOrgPermissions } = this.props;

    const canCreate = isAdminOrOwner(myOrgPermissions);

    return (
      // @ts-ignore
      <View flex={1}>
        <Analytics screenName={['community', 'challenges']} />
        <View style={styles.cardList}>
          <ChallengeFeed
            organization={organization}
            items={challengeItems}
            loadMoreItemsCallback={this.loadItems}
            refreshCallback={this.refreshItems}
            refreshing={refreshing}
            extraPadding={canCreate}
          />
        </View>
        {canCreate ? (
          <BottomButton onPress={this.create} text={t('create')} />
        ) : null}
      </View>
    );
  }
}

// @ts-ignore
const mapStateToProps = ({ auth, organizations }, { orgId = 'personal' }) => {
  const organization = organizationSelector({ organizations }, { orgId });

  return {
    organization,
    // @ts-ignore
    challengeItems: challengesSelector({
      challengeItems: organization.challengeItems || [],
    }),
    pagination: organization.challengePagination || {},
    // @ts-ignore
    myOrgPermissions: orgPermissionSelector(null, {
      person: auth.person,
      organization,
    }),
  };
};

export default connect(mapStateToProps)(GroupChallenges);
