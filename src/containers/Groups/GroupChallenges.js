import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

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

@translate('groupsChallenge')
export class GroupChallenges extends Component {
  state = { refreshing: false };

  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupChallengeFeed(organization.id));
  };

  reloadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(refreshCommunity(organization.id));
    return dispatch(reloadGroupChallengeFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  createChallenge = challenge => {
    const { dispatch, organization } = this.props;
    dispatch(createChallenge(challenge, organization.id));
  };

  create = () => {
    const { dispatch } = this.props;
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        onComplete: challenge => {
          this.createChallenge(challenge);
          dispatch(navigateBack());
        },
      }),
    );
  };

  render() {
    const { refreshing } = this.state;
    const { t, challengeItems, organization, myOrgPermissions } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ChallengeFeed
          organization={organization}
          items={challengeItems}
          loadMoreItemsCallback={this.loadItems}
          refreshCallback={this.refreshItems}
          refreshing={refreshing}
        />
        {isAdminOrOwner(myOrgPermissions) ? (
          <BottomButton
            onPress={this.create}
            text={t('create').toUpperCase()}
          />
        ) : null}
      </View>
    );
  }
}

export const mapStateToProps = (
  { auth, organizations },
  { organization = {} },
) => {
  const orgId = organization.id || 'personal';

  const selectorOrg =
    organizationSelector({ organizations }, { orgId }) || organization;

  const challengeItems = challengesSelector({
    challengeItems: (selectorOrg || {}).challengeItems || [],
  });

  return {
    challengeItems,
    pagination: selectorOrg.challengePagination,
    myOrgPermissions: orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: orgId },
    }),
  };
};

export default connect(mapStateToProps)(GroupChallenges);
