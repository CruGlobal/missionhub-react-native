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
import { navigatePush, navigateBack } from '../../actions/navigation';
import { refreshCommunity } from '../../actions/organizations';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { orgPermissionSelector } from '../../selectors/people';
import { ChallengeItem } from '../../components/ChallengeStats';
import { CommunitiesCollapsibleHeaderContext } from '../Communities/Community/CommunityHeader/CommunityHeader';
import { AuthState } from '../../reducers/auth';
import { OrganizationsState } from '../../reducers/organizations';

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
        organization,
        onComplete: (challenge: ChallengeItem) => {
          this.createChallenge(challenge);
          dispatch(navigateBack());
        },
      }),
    );
  };

  render() {
    const { refreshing } = this.state;
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      challengeItems,
      // @ts-ignore
      organization,
      // @ts-ignore
      myOrgPermissions,
    } = this.props;

    const canCreate = isAdminOrOwner(myOrgPermissions);

    return (
      <>
        <Analytics
          screenName={['community', 'challenges']}
          params={{ communityId: organization.id }}
          options={{
            includePermissionType: true,
          }}
        />
        <View style={styles.cardList}>
          <CommunitiesCollapsibleHeaderContext.Consumer>
            {({ collapsibleScrollViewProps }) => (
              <ChallengeFeed
                organization={organization}
                items={challengeItems}
                loadMoreItemsCallback={this.loadItems}
                refreshCallback={this.refreshItems}
                refreshing={refreshing}
                extraPadding={canCreate}
                collapsibleScrollViewProps={collapsibleScrollViewProps}
              />
            )}
          </CommunitiesCollapsibleHeaderContext.Consumer>
        </View>
        {canCreate ? (
          <BottomButton onPress={this.create} text={t('create')} />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (
  {
    auth,
    organizations,
  }: { auth: AuthState; organizations: OrganizationsState },
  {
    navigation: {
      state: {
        params: { communityId = 'personal' },
      },
    },
  }: { navigation: { state: { params: { communityId?: string } } } },
) => {
  const organization = organizationSelector(
    { organizations },
    { orgId: communityId },
  );

  return {
    organization,
    // @ts-ignore
    challengeItems: challengesSelector({
      challengeItems: organization.challengeItems || [],
    }),
    pagination: organization.challengePagination || {},
    myOrgPermissions: orgPermissionSelector(
      {},
      {
        person: auth.person,
        organization,
      },
    ),
  };
};

export default connect(mapStateToProps)(GroupChallenges);

export const COMMUNITY_CHALLENGES = 'nav/COMMUNITY_CHALLENGES';
